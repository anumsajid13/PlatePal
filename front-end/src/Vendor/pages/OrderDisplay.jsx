
import React, { useState, useEffect } from 'react';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import { FaPlusCircle, FaSearch, FaSort, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/CartList.css';

const CartList = () => {
  const [carts, setCarts] = useState([]);
  const { token } = useTokenStore();
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortOption, setSortOption] = useState('Time');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSortOptionDropdown, setShowSortOptionDropdown] = useState(false);


    const fetchCarts = async () => {
      try {
        const response = await fetch(`http://localhost:9000/vendor/cart?filterType=${filterType}&filterValue=${filterValue}&sortBy=${sortOption}&sortOrder=${sortOrder}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch carts');
        }

        const data = await response.json();
        setCarts(data);
      } catch (error) {
        console.error(error);
      }
    };
useEffect(() => {
    fetchCarts();
  }, [token,filterType, filterValue,  sortOption, sortOrder]);

  const handleGoBack = () => {
    navigate('/Vendor/Mainpage');
  };
  const handleSortOptionChange = (option,order) => {
    setSortOption(option);
    setSortOrder(order);
    setShowSortOptionDropdown(false);
    fetchCarts();
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
                        <option value="recipe" className='vendor-filter-options'>Search by Recipe Name</option>
                        <option value="recipeSeekerId" className='vendor-filter-options'>Search by RecipeSeeker</option>
                        <option value="chef"className='vendor-filter-options' >Search by Chef</option>
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
        
      <div className="header">
          <button className="back-button" onClick={handleGoBack}>
            <FaArrowLeft /> Back
          </button>
        </div>
      <div className="cart-container">
      
        <h1 className="cart-list-title">Cart List</h1>
        {carts.map((cart,cartIndex) => (
          <div key={cart._id} className="cart-item">
            <h2 className="cart-id">Cart ID: {/* {cart._id} */}{cartIndex+1}</h2>
            <p className="recipe-seeker">Recipe Seeker: {cart.recipeSeekerId && cart.recipeSeekerId.name}</p>
            <p className="total-amount">Total Amount: {cart.totalAmount}</p>
            <h2 className="orders-title">Orders:</h2>
            <ul className="order-list">
              {cart.orders.map((order, orderIndex) => (
                <div key={orderIndex} className="order-item">
                <h3 className="order-id">Order ID: {orderIndex+1}</h3>
                  <ul className="item-list">
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="item">
                        <p className="recipe">Recipe: {item.recipe && item.recipe.title}</p>
                        <p className="price">Price: {item.price}</p>
                        <p className="quantity">Quantity: {item.quantity}</p>
                        <p className="chef">Chef: {item.chefId && item.chefId.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartList;
