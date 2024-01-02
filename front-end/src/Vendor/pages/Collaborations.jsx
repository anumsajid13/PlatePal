import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import CollaborationCard from '../components/CollaborationCard';
import { FaArrowLeft, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

const CollaborationsList = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
 
  const [sortOption, setSortOption] = useState('Time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSortOptionDropdown, setShowSortOptionDropdown] = useState(false);

  const fetchCollaborations = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/collaboration?filterType=${filterType}&filterValue=${filterValue}&sortBy=${sortOption}&sortOrder=${sortOrder}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch collaborations');
      }
      const data = await response.json();
      setCollaborations(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollaborations();
  }, [token, filterType, filterValue,  sortOption, sortOrder]);

  const handleClick = () => {
    navigate('/Vendor/Mainpage');
  };

  const handleSortOptionChange = (option, order) => {
    setSortOption(option);
    setSortOrder(order);
    setShowSortOptionDropdown(false);
    fetchCollaborations();
  };

  return (
    <>
      <NavigationBar />
      <div className="discover-container-1">
                    <div className="search-card-11">
                    <input className='searchRecepie' type="text" placeholder="Search..."  value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)} />
                      <select  id="vendor-filterType"
                          name="vendor-filterType"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}className="search-dropdown-1">
                        <option value="empty"className='vendor-filter-options'>Search</option> 
                        <option value="chef"className='vendor-filter-options' >Search by Chef</option>
                        <option value="recipe" className='vendor-filter-options'>Search by Recipe Name</option>
                    </select>
                  
                    
                    </div>   
            </div>

        <div className="vendor-sort-dropdown">
          <button onClick={() => setShowSortOptionDropdown(!showSortOptionDropdown)}>
            Sort by {sortOption || 'Select'} <FaSort />
          </button>
          {showSortOptionDropdown && (
            <div className="vendor-sort-options-div">
              <div className="vendor-sort-options" onClick={() => handleSortOptionChange('Time', 'asc')}>
                time(asc)
              </div>
              <div className="vendor-sort-options" onClick={() => handleSortOptionChange('Time', 'desc')}>
                time(desc)
              </div>
            </div>
          )}
        </div>
      <div className="Requestheader">
        <button onClick={handleClick} className="backButton">
          <FaArrowLeft /> Back
        </button>
        <h1>Collaborations List</h1>

      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {collaborations.map((collaboration) => (
            <CollaborationCard key={collaboration._id} collaboration={collaboration} />
          ))}
        </div>
      )}
    </>
  );
};

export default CollaborationsList;
