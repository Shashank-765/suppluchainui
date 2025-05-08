const express = require('express');
const router = express.Router();
const User = require('../../Models/userModel.js');
const TrackingModel = require('../../Models/BatchProductModel.js');
const nodemailer = require("nodemailer")
const { authorize } = require('../../Auth/Authenticate.js')
const bcrypt = require('bcryptjs');
const { generateToken, generateWallet, generateRefreshToken } = require('../../Auth/Authenticate.js');


let transporter = nodemailer.createTransport({
  host: "mail.smtp2go.com",
  port: 2525,
  secure: false,
  auth: {
    user: 'Businessbay',
    pass: '4RlUtFpREiCs5tn7',
  },
});


router.post('/register', async (req, res) => {

  try {
    const { name, email, password, contact, role, userType, address } = req.body;
    if (!name || !email || !password || !contact) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const wallet = await generateWallet();
    const user = new User({
      name,
      email,
      password,
      role,
      userType,
      contact,
      address,
      walletAddress: wallet.address
    });
    await user.save();

    const jwtToken = generateToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }
    return res.status(200).json({ user, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });

  }

})

router.post('/createuser', authorize, async (req, res) => {

  try {
    const { name, email, contact, role, userType, address } = req.body;
    if (!name || !email || !contact) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const userCount = await User.countDocuments();

    let generatedPassword = '';
    if (name && contact && contact.length >= 7) {
      const namePart = name.slice(0, 3);
      const contactLast3 = contact.slice(-3);
      const lastDigit = contact.slice(-1);
      generatedPassword = `${namePart}${contactLast3}${lastDigit}@${userCount + 1}`;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const wallet = await generateWallet();
    const user = new User({
      name,
      email,
      password: generatedPassword,
      role,
      userType,
      contact,
      address,
      walletAddress: wallet.address
    });
    await user.save();

    const jwtToken = generateToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }

    const mailOptions = {
      from: 'arun@bastionex.net',
      to: email,
      subject: "Verify your email address",
      html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Confirmation</title>
            <style>
                .button {
                    background-color: #008CBA;
                    color: white;
                    padding: 10px 20px;
                    text-align: center;
                    text-decoration: none;
                    font-size: 16px;
                    border-radius: 5px;
                    display: inline-block;
                    margin-top: 10px;
                }

                .button:hover {
                    background-color: #005f7a;
                }

                table {
                    width: 600px;
                    margin: 0 auto;
                    border-collapse: collapse;
                }

                table td {
                    padding: 10px;
                }
            </style>
        </head>

        <body>
            <div style="margin:0;font-family: 'Lato', sans-serif;">
                <table style="width:600px;background-color:rgb(255,255,255);margin:0 auto;border-spacing:0;border-collapse:collapse">
                    <tbody>
                        <tr>
                            <td>
                                <p style="color:#000;text-align:center;font-size:16px;margin-bottom:20px;">
                                  Your login Id and password 
                                </p>
                                <p style="color:#000;text-align:center;font-size:16px;margin-bottom:20px;">
                                   Email ---  ${email}
                                   <br/>
                                   Password --- ${generatedPassword}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>

        </html>

      `,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ user, message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });

  }

})

router.post('/updateprofile', authorize, async (req, res) => {
  try {
    const { email, name, contact, address, userType } = req.body;

    const isExist = await User.findOne({ email });
    if (!isExist) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    isExist.name = name;
    isExist.contact = contact;
    isExist.address = address;
    isExist.userType = userType;

    await isExist.save();

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: isExist?._id,
        email: isExist.email,
        name: isExist.name,
        contact: isExist.contact,
        address: isExist.address,
        userType: isExist.userType
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    if (user?.isBlocked) {
      return res.status(400).json({ message: 'This user has been blocked' })
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong Password' });
    }

    const jwtToken = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    if (jwtToken) {
      user.token = jwtToken;
      await user.save();
    }
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ user, message: 'User logged in successfully' });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}
)

router.get('/fetchalluser', authorize, async (req, res) => {
  try {
    const { page = 1, limit = 5, search = '' } = req.query;

    const query = {
      userType: 'user', // Only users with userType === "user"
      $or: [
        { name: { $regex: search, $options: 'i' } },
        // { walletAddress: { $regex: search, $options: 'i' } },
        { contact: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ],
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const allUsers = await User.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const allUserwihtoutPagination = await User.find({});

    res.status(200).json({
      allUsers,
      allUserwihtoutPagination,
      totalUsers,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});
router.post('/blockUser', authorize, async (req, res) => {
  try {
    const { id } = req.query;

    const updatedUser = await User.findOne({ _id: id });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.isBlocked = true;
    await updatedUser.save();
    return res.status(200).json({ user: updatedUser, message: 'User blocked successfully' });
  } catch (error) {
    console.error('Error blocking user:', error);
    return res.status(500).json({ message: 'Server error while blocking user' });
  }
}
);
router.post('/unblockUser', authorize, async (req, res) => {
  try {
    const { id } = req.query;

    const updatedUser = await User.findOne({ _id: id });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    updatedUser.isBlocked = false;
    await updatedUser.save();
    return res.status(200).json({ user: updatedUser, message: 'User unblocked successfully' });
  } catch (error) {

    console.error('Error unblocking user:', error);
    return res.status(500).json({ message: 'Server error while unblocking user' });
  }
}
);

// router.post('/insertRoles', async (req, res) => {
//   const roleMap = {
//     FARM_INSPECTION: {
//       name: 'Farm Inspection',
//       className: 'label info',
//     },
//     HARVESTER: {
//       name: 'Harvester',
//       className: 'label success',
//     },
//     EXPORTER: {
//       name: 'Exporter',
//       className: 'label warning',
//     },
//     IMPORTER: {
//       name: 'Importer',
//       className: 'label danger',
//     },
//     PROCESSOR: {
//       name: 'Processor',
//       className: 'label primary',
//     },
//   };

//   const roleDocs = Object.entries(roleMap).map(([key, value]) => ({
//     key,
//     name: value.name,
//     className: value.className,
//   }));

//   try {
//     await Role.insertMany(roleDocs, { ordered: false });
//     res.status(201).json({ message: 'Roles inserted successfully.' });
//   } catch (err) {
//     if (err.code === 11000) {
//       res.status(409).json({ message: 'Some roles already exist.', error: err });
//     } else {
//       res.status(500).json({ message: 'Error inserting roles.', error: err });
//     }
//   }
// });

router.get('/getimages', authorize, async (req, res) => {
  try {
    const trackingRecords = await TrackingModel.find({});

    let allInspectedImages = [];
    let allImages = [];

    trackingRecords.forEach(record => {
      if (record.inspectedImages && record.inspectedImages.length > 0) {
        allInspectedImages.push(...record.inspectedImages);
      }
      if (record.images && record.images.length > 0) {
        allImages.push(...record.images);
      }
    });

    const randomInspectedImages = getRandomImages(allInspectedImages, 3);
    const randomImages = getRandomImages(allImages, 3);

    res.status(200).json({
      randomInspectedImages,
      randomImages,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Error fetching images' });
  }
});


function getRandomImages(arr, maxCount) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, maxCount);
}


// router.post('/renewtoken', async (req, res) => {
//   try {
//     const userId = req?.query?.userId;
//     const newToken = generateToken(userId);

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.token = newToken;
//     await user.save();

//     return res.json({ token: newToken });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Token renewal failed' });
//   }
// });


module.exports = router;