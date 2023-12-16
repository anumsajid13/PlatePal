const express = require('express');
const bcrypt = require('bcrypt');
const Chef = require('../../models/Chef Schema'); 
const router = express.Router();


router.post('/forgotpassword', async (req,res) => {

    const { email, newPassword } = req.body;

    try{

        //find chef by email
        const chef = await Chef.findOne({ email });

        if (!chef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        //generate new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update chef password in the db
        chef.password = hashedPassword;
        await chef.save();

        res.status(200).json({ message: 'Password updated successfully' });

    }
    catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;