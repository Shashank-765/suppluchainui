const express = require('express');
const router = express.Router();
const User = require('../../Models/userModel.js');
const NotifyModel = require('../../Models/NotifictionModel.js')
const { authorize } = require('../../Auth/Authenticate.js');


router.get('/notifications', authorize, async (req, res) => {
    try {
        const userId = req.query.id;
        const notifications = await NotifyModel.find({
            $or: [
                { farmInspection: userId },
                { harvester: userId },
                { importer: userId },
                { exporter: userId },
                { processor: userId }
            ],
            $or: [
                { [`readStatus.${userId}`]: { $ne: true } },
                { [`readStatus.${userId}`]: { $exists: false } }
            ],
            createdBy: { $ne: userId }
        }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }

})
router.get('/getallnotifications', authorize, async (req, res) => {
    try {
        const notifications = await NotifyModel.find({}).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }

})
router.post('/deletenotification',authorize, async (req, res) => {
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
        res.json({ success: true });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error })
    }
})


module.exports = router;