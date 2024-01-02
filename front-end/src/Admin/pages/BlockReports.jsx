// BlockReports.js

import React, { useEffect } from 'react';
import useBlockStore from './blockstore';
import './blockreport.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';
import { BASE_URL } from '../../url';
const BlockReports = () => {
  const { blockReports, setBlockReports } = useBlockStore();
  const token = useTokenStore((state) => state.token);

  const fetchBlockReports = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/view-vendor-block-reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched data:', data);
      setBlockReports(data.blockReports || []);
    } catch (error) {
      console.error(error);
    }
  };

  const blockVendor = async (vendorId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/block-vendor/${vendorId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedReports = blockReports.map((report) =>
        report.vendor._id === vendorId ? { ...report, vendor: { ...report.vendor, isBlocked: true } } : report
      );

      console.log('Updated Reports:', updatedReports);

      setBlockReports(updatedReports);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlockReports(token);
  }, [token,blockReports]);

  return (
    <div>
      <AdminNav />
      <div className="container">
        <h1>Block Reports</h1>
        {blockReports.map((report) => (
          <div key={report._id} className="block-report">
            <h3>Block User:</h3>
            <p className='para'>{report.vendor.name}</p>

            <h3>Complaint by Chef: </h3>
            <p className='para'>{report.chef.name}</p>  

            <h3>Reason: </h3>
            <p className='para'>{report.reason}</p>  
            
            <div className="proof-image-container">

            {report.proof && report.proof.contentType && (
              <img
                className="proof-image"
                src={`data:${report.proof.contentType};base64,${report.proof.data}`}
                alt="Proof"
              />
            )}
            </div>

            {/* Block button */}
            {!report.vendor.isBlocked && (
              <button className="block-button" onClick={() => blockVendor(report.vendor._id)}>
                Block
              </button>
            )}
            {report.vendor.isBlocked && <p className="status-text">Status: Blocked</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockReports;
