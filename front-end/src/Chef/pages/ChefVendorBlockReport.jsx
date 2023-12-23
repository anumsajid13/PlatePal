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
          await fetch(`http://localhost:9000/deleteVendorReport/${reportId}`, {
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

             <div>
                <h1>Vendor Block Reports</h1>
                {reports.map((report) => (
                    <div key={report._id}>
                    <p>Reason: {report.reason}</p>      
                    <p>Proof: {report.reason}</p>
                    <img style={{hight: '100px', width: '100px'}}src={`data:image/jpeg;base64,${report.proof.data}`} />
                    <button onClick={() => handleDelete(report._id)}>Delete</button>
                    
                    </div>
                ))}
            </div>  

        </>

    );


};

export default BlockReportsList ;