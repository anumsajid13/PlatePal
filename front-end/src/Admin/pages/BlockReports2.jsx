// ChefBlockReports.js

import React, { useEffect } from 'react';
import useBlockStore from './blockstore';
import './blockreport.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';

const ChefBlockReports = () => {
  const { blockReports, setBlockReports } = useBlockStore();
  const token = useTokenStore((state) => state.token);

  const fetchChefBlockReports = async (token) => {
    try {
      const response = await fetch('http://localhost:9000/admin/view-chef-block-reports', {
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

  const blockChef = async (chefId) => {
    try {
      const response = await fetch(`http://localhost:9000/admin/block-chef/${chefId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedReports = blockReports.map((report) =>
        report.chef._id === chefId ? { ...report, chef: { ...report.chef, isBlocked: true } } : report
      );

      console.log('Updated Reports:', updatedReports);

      setBlockReports(updatedReports);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchChefBlockReports(token);
  }, [token]);

  return (
    <div>
      <AdminNav />
      <div className="container">
        <h1>Chef Block Reports</h1>
        {blockReports.map((report) => (
          <div key={report._id} className="block-report">
            <h3>Block Chef:</h3>
            <p>{report.chef.name}</p>

            <h3>Complaint by Vendor: </h3>
            <p>{report.vendor.name}</p>

            <h3>Reason: </h3>
            <p>{report.reason}</p>

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
            {!report.chef.isBlocked && (
              <button className="block-button" onClick={() => blockChef(report.chef._id)}>
                Block
              </button>
            )}
            {report.chef.isBlocked && <p className="status-text">Status: Blocked</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefBlockReports;
