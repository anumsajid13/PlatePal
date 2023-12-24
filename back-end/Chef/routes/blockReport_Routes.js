const express = require('express');
const router = express.Router();
const authenticateToken = require('../../TokenAuthentication/token_authentication');
const multer = require('multer');
const VendorBlockReport = require('../../models/VendorBlockReport Schema');
const AdminNotification = require('../../models/Admin_Notification Schema'); 


//multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

//create a vendor block report
router.post('/createVendorReport/:vendorId', authenticateToken, upload.single('proof'), async (req, res) => {
    try {
      const {  reason } = req.body;
      const { vendorId } = req.params;
      const { buffer, mimetype } = req.file;
  
      const newVendorReport = new VendorBlockReport({
        vendor: vendorId,
        reason: reason,
        proof: {
          data: buffer,
          contentType: mimetype
        },
        chef:req.user.id,
      });
  
      const savedReport = await newVendorReport.save();
  
      //send notification to admin
      const adminNotification = new AdminNotification({
        user: '657dab6364bd105aeb65e8c7',
        sender: req.user.id, 
        senderType: 'Chef',
        type: 'Vendor Block Report',
        notification_text: `A vendor block report has been submitted by Chef ${req.user.name}.`
      });
      await adminNotification.save();
  
      res.status(201).json(savedReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});


//delete a vendor block report
router.delete('/deleteVendorReport/:reportId', authenticateToken, async (req, res) => {
    try {
      const { reportId } = req.params;

      await VendorBlockReport.findByIdAndDelete(reportId);

      const adminNotification = new AdminNotification({
        user: '657dab6364bd105aeb65e8c7',
        type: 'Vendor Block Report Deleted',
        notification_text: `A vendor block report has been deleted by Chef ${req.user.name}.`
      });
      await adminNotification.save();

      res.json({ message: 'Report deleted' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});
  
//get all vendor reports of a logged-in chef
  router.get('/myVendorReports', authenticateToken, async (req, res) => {
    try {
      const loggedInChefId = req.user.id;
    
      const reports = await VendorBlockReport.find({ chef: loggedInChefId });

      // Convert the image buffer to a Base64 string
      const reportswithBasestring = reports.map(report => {
        const unit8Array = new Uint8Array(report.proof.data);
        const base64string = Buffer.from(unit8Array).toString('base64');
        return{
          ...report.toObject(),
          proof: { data: base64string, contentType: report.proof.contentType }
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
      const report = await VendorBlockReport.findById(reportId);

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
