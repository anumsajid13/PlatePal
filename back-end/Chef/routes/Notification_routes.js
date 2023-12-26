const express = require('express');
const Chef_Notification = require('../../models/Chef_Notification Schema'); 
const autheticateToken = require('../../TokenAuthentication/token_authentication');
const router = express.Router();

router.get('/notifications', autheticateToken,  async(req,res) => {

    try{
        const notifications = await Chef_Notification.find({ user: req.user.id })
            .sort({ Time: -1 }) //sort in descending order
          
            res.status(200).json(notifications);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});

router.delete('/deletenotifications/:id', autheticateToken, async (req, res) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user.id;

        
        const notification = await Chef_Notification.findOne({
            _id: notificationId,
            user: userId
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await Chef_Notification.findByIdAndDelete(notificationId);

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



module.exports = router;


