const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const vendor = require('../../models/Vendor Schema');
const Chef=require('../../models/Chef Schema');
const AdminNotification = require('../../models/Admin_Notification Schema'); 
const BlockReport = require('../../models/VendorBlockchef Schema');
const multer = require('multer');

//multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

//create a vendor block report
router.post('/createBlockReport/:chefId', authenticateToken, upload.single('proof'), async (req, res) => {
    try {
      const {  reason } = req.body;
      const {  chefId } = req.params;
      const newBlockReport = new BlockReport({
        chef: chefId,
        reason: reason,
        proof: {
          data: req.file.buffer,
          contentType: req.file.mimetype
        },
        vendor:req.user.id,
        status: 'Pending',
      });
  
      const savedReport = await newBlockReport.save();
  
      //send notification to admin
      const adminNotification = new AdminNotification({
        user: '657dab6364bd105aeb65e8c7',
        sender: req.user.id, 
        senderType: 'Vendor',
        type: 'Chef Block Report',
        notification_text: `A chef block report has been submitted by vendor ${req.user.name}.`
      });
      await adminNotification.save();
  
      res.status(201).json(savedReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});



//retract a vendor block report
router.delete('/retractBlockReport/:reportId', authenticateToken, async (req, res) => {
    try {
      const { reportId } = req.params;

      const report=await BlockReport.findById(reportId);
      if (report.status === 'Approved' || report.status === 'Rejected') {
        return res.status(400).json({ message: `Report has already been ${report.status}` });
        
      }
      

      const adminNotification = new AdminNotification({
        user: '657dab6364bd105aeb65e8c7',
        type: 'Chef Block Report Deleted',
        notification_text: `A chef block report has been retracted by vendor${req.user.name}.`
      });
      await adminNotification.save();

      return res.json({ message: 'Report successfully retracted' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});
  
router.get('/ChefBlockReports', authenticateToken, async (req, res) => {
  try {
    const loggedInVendorId = req.user.id;

    const reports = await BlockReport.find({ vendor: loggedInVendorId })
      .populate({ path: 'chef', select: 'name', model: 'Chef' });

    const reportsWithBase64String = reports.map(report => ({
      ...report.toObject(),
      proof: {
        data: report.proof.data.toString('base64'),
        contentType: report.proof.contentType,
      },
      chef: report.chef ? report.chef.name : 'Chef Name Not Available',
    }));

    return res.status(200).json(reportsWithBase64String);
  } catch (error) {

    res.status(500).json({ message: 'Error fetching block reports', error: error.message });
  }
});

  
//get a specific vendor block report
  router.get('/getVendorReport/:reportId', authenticateToken, async (req, res) => {
    try {
      const { reportId } = req.params;
      const report = await BlockReport.findById(reportId);

      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }

      res.json(report);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/getAllChefs', async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.status(200).json(chef.name,chef.email,chef.profile);
  } catch (error) {
    console.error('Error getting chefs information:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
module.exports = router;
