import {React, useState} from 'react';
import useTokenStore from '../../tokenStore';
import './reportPopup.css';

const ReportPopUp = ({ vendorId, onClose  }) => {

    const [reason, setReason] = useState('');
    const [proof, setProof] = useState(null);

    console.log(vendorId)

    const { token, setToken } = useTokenStore(); 
     //function to handle proof picture change
     const handleProofChange = (event) => {
        const file = event.target.files[0];
        setProof(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('reason', reason);
        formData.append('proof', proof); // Assuming selectedFile is the uploaded image file
    
        try {
            const response = await fetch(`http://localhost:9000/chef/createVendorReport/${vendorId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Error creating vendor report');
            }
    
            console.log(response)
            onClose();
        } catch (error) {
            console.error('Error creating vendor report:', error);
            
        }
    };
    
    return(

        <>
            <div class="report-popup-overlay">
            <div className="reprort-popup-container">
            <div className="report-popup-inner">
                    <button className="report-chef-pop-close-btn" onClick={onClose} >
                        <span className="material-icons">close</span>
                    </button>
                <h2 className='reportt-heading'>Report Vendor</h2>
                <form onSubmit={handleSubmit}>
                    <label className='create-recipe-label' htmlFor="reason">Reason:</label>
                    <input className='reportt-input'
                        type="text"
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <label className='create-recipe-label' htmlFor="reason">Proof:</label>
                    <input 
                        type="file"
                        accept="image/*"
                        onChange={handleProofChange}
                    />
                    <button className='create-recipe-button' type="submit">Submit</button>
                </form>
                
            </div>
            </div>
            </div>
        </>

    );


};

export default ReportPopUp;