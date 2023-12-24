const express = require('express');
const Chef_Notification = require('../../models/Chef_Notification Schema'); 
const autheticateToken = require('../../TokenAuthentication/token_authentication');
const router = express.Router();

router.get('/notifications', autheticateToken,  async(req,res) => {

    try{
        const notifications = await Chef_Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 }) //sort in descending order
          
            res.status(200).json(notifications);
    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }

});

module.exports = router;


