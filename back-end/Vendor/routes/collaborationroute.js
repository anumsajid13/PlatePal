const express = require('express');
const router = express.Router();
const VendorCollaboration = require('../models/VendorCollaboration');

// Endpoint to create a new vendor collaboration request
// Endpoint to get a chef collaborations requests
router.get('/vendor/collaboartionRequests/:vendorId', async (req, res) => {
const vendorId=req.params.vendorId;
try {
    const collaborationReq = await VendorCollaboration.find({vendorId:vendorId});
    if(!collaborationReq)
    {
        return res.status(400).send("No collaboration requests found");
    }
    res.status(200).send(collaborationReq);

    
}
catch (err) {
    res.json({ message: err });

}
});

//Endpoint to get a sepcific chef collaborations requests 
router.get('/vendor/collaboartionRequests/:vendorId/:chefId', async (req, res) => {
const chefId=req.params.chefId;
const vendorId=req.params.vendorId;


}
);
//Endpoint to see all collaborations of a vendor

//Endpoint to see all collaborations from a specific chef