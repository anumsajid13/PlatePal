const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const vendor = require('../../models/Vendor Schema');
const Chef=require('../../models/Chef Schema');
const AdminNotification = require('../../models/Admin_Notification Schema'); 
const BlockReport = require('../../models/vendorBlockchef Schema');
const multer = require('multer');

//multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

//create a vendor block report
router.post('/createBlockReport/:vendorId', authenticateToken, upload.single('proof'), async (req, res) => {
    try {
      const {  reason } = req.body;
      const { vendorId } = req.params;
      const { buffer, mimetype } = req.file;
  
      const newBlockReport = new BlockReport({
        vendor: vendorId,
        reason: reason,
        proof: {
          data: buffer,
          contentType: mimetype
        },
        vendor:req.user.id,
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



//delete a vendor block report
router.delete('/deleteBlockReport/:reportId', authenticateToken, async (req, res) => {
    try {
      const { reportId } = req.params;

      await BlockReport.findByIdAndDelete(reportId);

      const adminNotification = new AdminNotification({
        user: '657dab6364bd105aeb65e8c7',
        type: 'Chef Block Report Deleted',
        notification_text: `A chef block report has been deleted by vendor${req.user.name}.`
      });
      await adminNotification.save();

      res.json({ message: 'Report deleted' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});
  
//get all vendor reports of a logged-in chef
  router.get('/BlockReports', authenticateToken, async (req, res) => {
    try {
      const loggedInChefId = req.user.id;
    
      const reports = await BlockReport.find({ chef: loggedInChefId })
      .populate({ path: 'vendor', select: 'name', model: 'Vendor' })
      .populate({ path: 'chef', select: 'name', model: 'Chef' });

      // Convert the image buffer to a Base64 string
      const reportswithBasestring = reports.map(report => {
        const unit8Array = new Uint8Array(report.proof.data);
        const base64string = Buffer.from(unit8Array).toString('base64');
        const vendorName = report.vendor ? report.vendor.name : 'Vendor Name Not Available';
         const chefName = report.chef ? report.chef.name : 'Chef Name Not Available';
        return{
          ...report.toObject(),
          proof: { data: base64string, contentType: report.proof.contentType },
          vendor: vendorName, 
          chef: chefName
        };
      });
     
      return res.status(200).json(reportswithBasestring);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
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

 
module.exports = router;
