import React, { useState, useEffect } from 'react';
import '../../Chef/components/reportPopup.css';
import ChefGenericPopup from '../../Chef/components/ChefGenericPopup';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';

const BlockedchefReportsList  = () => {

    const [reports, setReports] = useState([]);

    const { token } = useTokenStore();
    useEffect(() => {
        const fetchReports = async () => {
          try {
            const response = await fetch('http://localhost:9000/vendor/BlockReport/ChefBlockReports', {
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
         const response= await fetch(`http://localhost:9000/vendor/BlockReport/retractBlockReport/${reportId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          alert(response.message);
          setReports(reports.filter((report) => report._id !== reportId));
        } catch (error) {
          console.error('Error deleting report:', error);
        }
      };
    return(

        <>
             <NavigationBar/>

             <div className="vendorbr-list">
                    <h1>Vendor Block Reports</h1>
                    
                <div className='itemsss'>
                {reports.length > 0 ? (
                    reports.map((report) => (
            
                        <div className="vendor-br-item" key={report._id}>

                          <div className='vendor-br-alignment'>
                        <h1>Reason:</h1> <p> {report.reason}</p>
                        <h1>Vendor:</h1> <p>{report.vendor}</p> 
                        <h1>Chef:</h1> <p>{report.chef}</p> 
                        <h1>Proof:</h1>
                        <img className='vendor-chef-br-image' src={`data:image/jpeg;base64,${report.proof.data}`} alt={`Proof for report ${report._id}`} />
                        <button className='vendor-chef-br' onClick={() => handleDelete(report._id)}>Retract</button>
                        </div>
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

export default BlockedchefReportsList ;