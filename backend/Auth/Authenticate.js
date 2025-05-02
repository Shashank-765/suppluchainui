const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');
const bcrypt = require('bcryptjs');
const User = require('../Models/userModel.js');
const mnemonic = process.env.mnemonic;
const SECRET = process.env.JWT_SECRET;



const generateToken = (id) => {
    return jwt.sign({ id }, SECRET, { expiresIn: "15m" });
};

const generateWallet = async () => {
    try {
        const patientCount = await User.countDocuments();
        const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
        const wallet = hdNode.deriveChild(patientCount);

        return {
            address: wallet.address,
        };
    } catch (error) {
        throw new Error("Wallet creation failed: " + error.message);
    }
};

const authorize = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token missing' });
    }
    try {
        const decoded = jwt.verify(token, SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        req.userData = user;
        req.id = user.id;
        next();
    } catch (err) {
        console.error('JWT Error:', err);
        res.status(401).json({ success: false, message: 'Unauthorized user', error: err.message });
    }
};


module.exports = {
    generateToken,
    generateWallet,
    authorize
};
