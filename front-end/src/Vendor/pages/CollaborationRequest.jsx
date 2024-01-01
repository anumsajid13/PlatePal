import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import { FaArrowLeft,FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import CollaborationRequestCard  from '../components/RequetsCard';
import "../assets/styles/request.css";
const CollaborationsRequestsList = () => {
  const [collaborationRequests, setCollaborationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortOption, setSortOption] = useState('Time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSortOptionDropdown, setShowSortOptionDropdown] = useState(false);

    const fetchRequests = async () => {
      try {
        
        const response = await fetch(`http://localhost:9000/collaboration-request?filterType=${filterType}&filterValue=${filterValue}&sortBy=${sortOption}&sortOrder=${sortOrder}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            });
        if(!response.ok) {
            throw new Error('Failed to fetch collaborations');
          }
        const data = await response.json();
        console.log("data",data);
        setCollaborationRequests(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collaborations:', error);
        setLoading(false);
      }
    };
useEffect(() => {
    fetchRequests();
  }, [token, filterType, filterValue,  sortOption, sortOrder]);
const handleClick = () => {

    navigate('/Vendor/Mainpage');
};
const handleSortOptionChange = (option,order) => {
  setSortOption(option);
  setSortOrder(order);
  setShowSortOptionDropdown(false);
  fetchRequests();
};

  return (
    <>
    <NavigationBar />
    <div className="discover-container-1">
                    <div className="search-card-11">
                    <input className='searchRecepie' type="text" placeholder="Search..."  value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}  />
                      <select  id="vendor-filterType"
                          name="vendor-filterType"
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)} >
                        <option value="recipe"className="sortButton">Search by Recipe Name</option>
                        <option value="status"className="sortButton">Search by Status</option>
                        <option value="chef" className="sortButton" >Search by Chef</option>
                    </select>
                  
                    
                    </div>   
            </div>

        <div className="vendor-sort-dropdown">
          <button onClick={() => setShowSortOptionDropdown(!showSortOptionDropdown)} className='sortButton'>
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
        <h1>Collaboration Requests List</h1>
        </div>
     <div>
     
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mainRequestContainer">

          {collaborationRequests.map(collaboration => (
          
            <CollaborationRequestCard key={collaboration._id} request={collaboration} />
          ))}
        </div>
      )}
    </div>
     
    </>
  
  );
};

export default CollaborationsRequestsList;
