import Indiviual from './Products';
import '../assets/styles/mainpage.css';
import { React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import { FaArrowLeft, FaArrowRight,FaPlusCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const MainPage = () => {

  
  const [ingredients, setIngredients] = useState([]);
  const { token } = useTokenStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/Ingredients/All?page=${currentPage}&pageSize=4`,
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
setTotalPages(20);
    fetchAllIngredients();
  }, [currentPage, token]);

  const handleDelete = async (ingredientId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/Ingredients/delete/${ingredientId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          'Failed to delete the ingredient!',
          response.message
        );
      }
      const data = await response.json();
      console.log('Ingredient deleted successfully:', data.message);
    setIngredients(ingredients.filter((ingredient) => ingredient._id !== ingredientId));
      setCurrentPage(1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
const handleAddNewIngredient = async () => {
navigate('/ingredients/newProduct');
}
  return (
    <>
      <NavigationBar />
      <div >
        <div className="mainContainer" >
          <div className="productSearch1">
            <input className="searchProducts" type="text" placeholder="Search..." />
            <select className="searchDropdown">
              <option value="recipeName">Search by Recipe Name</option>
              <option value="chef">Search by Chef</option>
            </select>
            <span className="search-icon-1">&#128269;</span>
          </div>
        </div>
        <div className='BigClass'>
        <button className="add-ingredient-button" onClick={handleAddNewIngredient}>
          Add New Ingredient <FaPlusCircle />
        </button>
        <div className="IngredientsContainer">
          {ingredients.map((individual) => (
            <Indiviual
              key={individual._id}
              ingredients={individual}
              handleDelete={handleDelete}
            />
          ))}
          </div>
        </div>
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <FaArrowLeft /> Previous
          </button>
          <span>{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainPage;
