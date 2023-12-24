const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const NutritionistNotification = require('../../models/Nutritionist_Notification Schema');
const Nutritionist = require('../../models/Nutritionist Schema');

router.post('/sendNotification/:nutritionistId',authenticateToken, async (req, res) => {
  const { nutritionistId } = req.params;
  const { notification_text, bmi } = req.body;

  try {
   
    const nutritionist = await Nutritionist.findById(nutritionistId);
    if (!nutritionist) {
      return res.status(404).json({ message: 'Nutritionist not found' });
    }

    const newNotification = new NutritionistNotification({
      user: nutritionistId,
      sender:req.user.id,
      type:"Send Meal Plans",
      notification_text,
      bmi,
    });

   
    await newNotification.save();

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
