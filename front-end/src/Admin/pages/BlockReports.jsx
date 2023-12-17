// BlockReports.js

import React, { useEffect } from 'react';
import useBlockStore from './blockstore';
import './blockreport.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';

const BlockReports = () => {
  const { blockReports, setBlockReports } = useBlockStore();
  const token = useTokenStore((state) => state.token);

  const fetchBlockReports = async (token) => {
    try {
      const response = await fetch('http://localhost:9000/admin/view-vendor-block-reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('Fetched data:', data);
      setBlockReports(data.blockReports || []); // Set the state to an array, or an empty array if data.blockReports is falsy
    } catch (error) {
      console.error(error);
    }
  };

  const blockVendor = async (vendorId) => {
    try {
      const response = await fetch(`http://localhost:9000/admin/block-vendor/${vendorId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the blockReports state to reflect the blocked vendor
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
  }, [token]);

  return (
    <div>
      <AdminNav />
      <div className="container">
        <h1>Block Reports</h1>
        {blockReports.map((report) => (
          <div key={report._id} className="block-report">
            <h3>Block User:</h3>
            <p>{report.vendor.name}</p>
            <p>Reason: {report.reason}</p>
            {report.proof && (
              <img
                src={`data:${report.proof.contentType};base64,${report.proof.data.toString('base64')}`}
                alt="Proof"
              />
            )}

            {/* Block button */}
            {!report.vendor.isBlocked && (
              <button onClick={() => blockVendor(report.vendor._id)}>Block</button>
            )}
            {report.vendor.isBlocked && <p>Status: Blocked</p>}

          </div>
        ))}
      </div>
    </div>
  );
};

export default BlockReports;
