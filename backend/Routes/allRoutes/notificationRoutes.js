const express = require('express');
const router = express.Router();
const User = require('../../Models/userModel.js');
const BatchModel = require('../../Models/BatchModel.js')
const NotifyModel = require('../../Models/NotifictionModel.js')
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
//                         { buyerId: userId },
//                         { sellerId: userId },
//                         { retailerId: userId }
//                     ]
//                 },
//                 {
//                     $or: [
//                         { [`readStatus.${userId}`]: { $ne: true } },
//                         { [`readStatus.${userId}`]: { $exists: false } },
//                         { [`buyerReadStatus.${userId}`]: { $ne: true } },
//                         { [`buyerReadStatus.${userId}`]: { $exists: false } }
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
  
      // 1. Fetch batch creation notifications (readStatus)
      const batchNotificationsRaw = await NotifyModel.find({
        $and: [
          {
            $or: [
              { farmInspection: userId },
              { harvester: userId },
              { importer: userId },
              { exporter: userId },
              { processor: userId },
              { createdBy: userId }
            ]
          },
          {
            $or: [
              { [`readStatus.${userId}`]: { $ne: true } },
              { [`readStatus.${userId}`]: { $exists: false } }
            ]
          }
        ]
      }).sort({ createdAt: -1 });
  
      // 2. Fetch purchase notifications (buyerReadStatus)
      const purchaseNotificationsRaw = await NotifyModel.find({
        [`buyerReadStatus.${userId}`]: { $exists: true, $ne: true }
      });
  
      // Add custom "Product sold" message
      const purchaseNotifications = purchaseNotificationsRaw.map((notif) => ({
        ...notif.toObject(),
        msg: 'Product sold'
      }));
  
      // 3. Index purchase notifications by batchId
      const purchaseMap = new Map();
      purchaseNotifications.forEach(p => {
        if (!purchaseMap.has(p.batchId)) purchaseMap.set(p.batchId, []);
        purchaseMap.get(p.batchId).push(p);
      });
  
      // 4. Combine creation notifications with related purchase notifications
      const combined = [];
      const usedPurchaseIds = new Set();
  
      batchNotificationsRaw.forEach(batch => {
        combined.push(batch); // Always push creation first
        const purchases = purchaseMap.get(batch.batchId) || [];
        purchases.forEach(p => {
          combined.push(p);
          usedPurchaseIds.add(p._id.toString());
        });
      });
  
      // 5. Add unmatched purchase notifications at the end
      purchaseNotifications.forEach(p => {
        if (!usedPurchaseIds.has(p._id.toString())) {
          combined.push(p);
        }
      });
  
      // 6. Final response
      res.json(combined);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || 'Server error' });
    }
  });
  

router.get('/getallnotifications', authorize, async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 5;

        const notifications = await NotifyModel.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const enrichedNotifications = await Promise.all(
            notifications.map(async (ele) => {
                const batch = await BatchModel.findOne({ batchId: ele.batchId });
                return {
                    ...ele.toObject(),
                    coffeeType: batch?.coffeeType || null,
                };
            })
        );

        res.json(enrichedNotifications);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
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
        await NotifyModel.updateOne(
            { _id: notificationId },
            { $set: { [`buyerReadStatus.${userId}`]: true } }
        );
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
})


module.exports = router;