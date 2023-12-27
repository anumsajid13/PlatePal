import Indiviual from './Products';
import '../assets/styles/mainpage.css';
import '../assets/styles/search.css';
import { React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import { FaPlusCircle ,FaSearch,FaSort} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const MainPage = () => {
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Time'); // Sorting option: Name, Type, Price, Quantity
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting order: asc, desc
  const [showSortOptionDropdown, setShowSortOptionDropdown] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const { token } = useTokenStore();
  const navigate = useNavigate();

  const fetchIngredients = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/Ingredients/All?filterType=${filterType}&filterValue=${filterValue}&search=${searchTerm}&sortBy=${sortOption}&sortOrder=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch Ingredients', response.message);
      }
      const data = await response.json();
      setIngredients(data);
    } catch (error) {
      console.error('Error fetching Ingredients:', error.message);
    }
  };

  useEffect(() => {
    fetchIngredients();
  }, [token, filterType, filterValue, searchTerm, sortOption, sortOrder]);

  const handleDelete = async (ingredientId) => {
    try {
      const response = await fetch(`http://localhost:9000/Ingredients/delete/${ingredientId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete the ingredient!', response.message);
      }
      const data = await response.json();
      console.log('Ingredient deleted successfully:', data.message);
      setIngredients(ingredients.filter((ingredient) => ingredient._id !== ingredientId));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAddNewIngredient = async () => {
    navigate('/ingredients/newProduct');
  };

  const handleSortOptionChange = (option,order) => {
    setSortOption(option);
    setSortOrder(order);
    setShowSortOptionDropdown(false);
    fetchIngredients();
  };




  return (
    <>
      <NavigationBar />
      <div className="discover-container-1">
        <div className="search-card-11">
          <input
            className="searchRecepie"
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button-1" onClick={fetchIngredients}>
            Search <FaSearch />
          </button>
        </div>
      </div>

      <div>
        <div className="BigClass">
        <span className="vendor-filter-container">
      <label htmlFor="vendor-filterType">Filter:</label>
      <select
        id="vendor-filterType"
        name="vendor-filterType"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option className="vendor-filter-options" value="">Select</option>
        <option className="vendor-filter-options" value="type">Type</option>
        <option className="vendor-filter-options" value="price">Price</option>
        <option className="vendor-filter-options" value="quantity">Quantity</option>
      </select>

      {filterType && (
        <input
          type="text"
          placeholder={`Enter ${filterType}`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
      )}
     
    </span>
    <button className="add-ingredient-button" onClick={handleAddNewIngredient}>
            Add New Ingredient <FaPlusCircle />
          </button>
        
          
          <div className="vendor-sort-dropdown">
            <button onClick={() => setShowSortOptionDropdown(!showSortOptionDropdown)}>
              Sort by {sortOption || 'Select'} <FaSort />
            </button>
            {showSortOptionDropdown && (
              <div className="vendor-sort-options-div">
              <div  className="vendor-sort-options"onClick={() => handleSortOptionChange('Time','asc')}>time(asc)</div>
                <div  className="vendor-sort-options" onClick={() => handleSortOptionChange('Time','desc')}>time(desc)</div>
                <div  className="vendor-sort-options" onClick={() => handleSortOptionChange('price','asc')}>Price(asc)</div>
                <div  className="vendor-sort-options" onClick={() => handleSortOptionChange('price','desc')}>Price(desc)</div>
                <div  className="vendor-sort-options" onClick={() => handleSortOptionChange('quantity','asc')}>Quantity(acs)</div>
                <div  className="vendor-sort-options"onClick={() => handleSortOptionChange('quantity','desc')}>Quantity(desc)</div>
              </div>
            )}
          </div>
          <div className="IngredientsContainer">
            {ingredients.map((individual) => (
              <Indiviual key={individual._id} ingredients={individual} handleDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainPage;


