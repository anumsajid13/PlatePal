import React, { useState, useEffect } from 'react';
import './chefVendorBlockReport.css'
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';


const BlockReportsList  = () => {

    const [reports, setReports] = useState([]);
    const { token, setToken } = useTokenStore(); 

    useEffect(() => {
        const fetchReports = async () => {
          try {
            const response = await fetch('http://localhost:9000/chef/myVendorReports', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
            const data = await response.json();
            console.log('bocl',data)
            setReports(data);
          } catch (error) {
            console.error('Error fetching reports:', error);
          }
        };
    
        fetchReports();
      }, []);
    
      const handleDelete = async (reportId) => {
        try {
          await fetch(`http://localhost:9000/chef/deleteVendorReport/${reportId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          setReports(reports.filter((report) => report._id !== reportId));
        } catch (error) {
          console.error('Error deleting report:', error);
        }
      };
    return(

        <>
             <ChefNav/>

             <div className="vendorbr-list">
                    <h1>Vendor Block Reports</h1>
                    
                <div className="vendor-br-item">
                {reports.length > 0 ? (
                    reports.map((report) => (
            
                        <div className="vendor-br-alignment" key={report._id}>
                        <h1>Reason:</h1> <p> {report.reason}</p>
                        <h1>Proof:</h1>
                        <img className='vendor-chef-br-image' src={`data:image/jpeg;base64,${report.proof.data}`} alt={`Proof for report ${report._id}`} />
                        <button className='vendor-chef-br' onClick={() => handleDelete(report._id)}>Delete</button>
                        </div>
                       
                    ))
                    ) : (
                    <p>No reports</p>
                )}
                </div>
            </div>  

        </>

    );


};

export default BlockReportsList ;