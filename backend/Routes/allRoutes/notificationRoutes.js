const express = require('express');
const router = express.Router();
const BatchModel = require('../../Models/BatchModel.js')
const { NotifyModel, PurchaseNotifyModel } = require('../../Models/NotifictionModel.js')
const { authorize } = require('../../Auth/Authenticate.js');


// router.get('/notifications', authorize, async (req, res) => {
//     try {
//         const userId = req.query.id;
//         const notifications = await NotifyModel.find({
//             $and: [
//                 {
//                     $or: [
//                         { farmInspection: userId },
//                         { harvester: userId },
//                         { importer: userId },
//                         { exporter: userId },
//                         { processor: userId },
//                         { createdBy: userId },
//                     ]
//                 },
//                 {
//                     $or: [
//                         { [`readStatus.${userId}`]: { $ne: true } },
//                         { [`readStatus.${userId}`]: { $exists: false } },
//                     ]
//                 }
//             ]
//         }).sort({ createdAt: -1 });

//         const PurchasedNotifications = await PurchaseNotifyModel.find({
//             $and: [
//                 {
//                     $or: [
//                         { farmInspection: userId },
//                         { harvester: userId },
//                         { importer: userId },
//                         { exporter: userId },
//                         { processor: userId },
//                         { createdBy: userId },
//                     ]
//                 },
//                 {
//                     $or: [
//                         { [`readStatus.${userId}`]: { $ne: true } },
//                         { [`readStatus.${userId}`]: { $exists: false } },
//                     ]
//                 }
//             ]
//         }).sort({ createdAt: -1 });

//         res.json(notifications);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message || 'Server error' });
//     }
// });

router.get('/notifications', authorize, async (req, res) => {
  try {
    const userId = req.query.id;
    const query = {
      $and: [
        {
          $or: [
            { farmInspection: userId },
            { harvester: userId },
            { importer: userId },
            { exporter: userId },
            { processor: userId },
            { createdBy: userId },
          ]
        },
        {
          $or: [
            { [`readStatus.${userId}`]: { $ne: true } },
            { [`readStatus.${userId}`]: { $exists: false } },
          ]
        }
      ]
    };

    const [batchNotifications, purchaseNotifications] = await Promise.all([
      NotifyModel.find(query),
      PurchaseNotifyModel.find(query)
    ]);

    const allNotifications = [...batchNotifications, ...purchaseNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(allNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// router.get('/getallnotifications', authorize, async (req, res) => {
//     try {
//         const skip = parseInt(req.query.skip) || 0;
//         const limit = parseInt(req.query.limit) || 5;

//         const notifications = await NotifyModel.find({})
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const enrichedNotifications = await Promise.all(
//             notifications.map(async (ele) => {
//                 const batch = await BatchModel.findOne({ batchId: ele.batchId });
//                 return {
//                     ...ele.toObject(),
//                     coffeeType: batch?.coffeeType || null,
//                 };
//             })
//         );

//         res.json(enrichedNotifications);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message: error.message });
//     }
// });

router.get('/getallnotifications', authorize, async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 5;

    const [batchNotifications, purchaseNotifications] = await Promise.all([
      NotifyModel.find({}),
      PurchaseNotifyModel.find({})
    ]);

    const allNotifications = [...batchNotifications, ...purchaseNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const paginatedNotifications = allNotifications.slice(skip, skip + limit);

    const enriched = await Promise.all(
      paginatedNotifications.map(async (ele) => {
        const batch = await BatchModel.findOne({ batchId: ele.batchId });
        return {
          ...ele.toObject(),
          coffeeType: batch?.coffeeType || null
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

router.post('/deletenotification', authorize, async (req, res) => {
    try {
        const notificationId = req.query.id;

        if (!notificationId) {
            return res.status(400).json({ message: 'Notification ID is required' });
        }

        const deletedNotification = await NotifyModel.findByIdAndDelete(notificationId);

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        return res.status(200).json({ data: deletedNotification, message: 'Deleted successfully' });

    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({ message: 'Server error while deleting notification' });
    }
});

router.post('/notified', authorize, async (req, res) => {
    try {
        const { notificationId } = req.query;
        const userId = req.userData.id;
        await NotifyModel.updateOne(
            { _id: notificationId },
            { $set: { [`readStatus.${userId}`]: true } }
        );
        await PurchaseNotifyModel.updateOne(
            { _id: notificationId },
            { $set: { [`readStatus.${userId}`]: true } }
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
})

module.exports = router;