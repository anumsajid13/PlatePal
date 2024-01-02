// NutritionistBlockReports.js

import React, { useEffect } from 'react';
import useBlockStore from './blockstore';
import './blockreport.css';
import useTokenStore from '../../tokenStore';
import AdminNav from '../components/AdminNav';
import { BASE_URL } from '../../url';

const NutritionistBlockReports = () => {
  const { blockReports, setBlockReports } = useBlockStore();
  const token = useTokenStore((state) => state.token);

  const fetchNutritionistBlockReports = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/view-nutritionist-block-reports`, {
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

  const blockNutritionist = async (nutritionistId) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/block-nutritionist/${nutritionistId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedReports = blockReports.map((report) =>
        report.nutritionist._id === nutritionistId
          ? { ...report, nutritionist: { ...report.nutritionist, isBlocked: true } }
          : report
      );

      console.log('Updated Reports:', updatedReports);

      setBlockReports(updatedReports);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNutritionistBlockReports(token);
  }, [token]);

  return (
    <div>
      <AdminNav />
      <div className="container">
        <h1>Nutritionist Block Reports</h1>
        {blockReports.map((report) => (
          <div key={report._id} className="block-report">
            <h3>Block Nutritionist:</h3>
            <p>{report.nutritionist.name}</p>

            <h3>Complaint by Recipe Seeker: </h3>
            <p>{report.recipeSeeker.name}</p>

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
            {!report.nutritionist.isBlocked && (
              <button className="block-button" onClick={() => blockNutritionist(report.nutritionist._id)}>
                Block
              </button>
            )}
            {report.nutritionist.isBlocked && <p className="status-text">Status: Blocked</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionistBlockReports;
