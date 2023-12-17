import Indiviual from './Products';
import '../assets/styles/mainpage.css';
import { React, useEffect, useState } from 'react';
import useTokenStore from '../../tokenStore';
import NavigationBar from '../components/NavigationBar';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const MainPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const { token } = useTokenStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchAllIngredients = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/Ingredients/All?page=${currentPage}&pageSize=30`,
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
      // Refresh the ingredients list after deletion
      setCurrentPage(1);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <NavigationBar />
      <div>
        <div className="container">
          <div className="search-card-1">
            <input className="searchRecepie" type="text" placeholder="Search..." />
            <select className="search-dropdown-1">
              <option value="recipeName">Search by Recipe Name</option>
              <option value="chef">Search by Chef</option>
            </select>
            <span className="search-icon-1">&#128269;</span>
          </div>
        </div>
        <div>
          {ingredients.map((individual) => (
            console.log('in mainpage', individual),
            <Indiviual
              key={individual._id}
              ingredients={individual}
              handleDelete={handleDelete}
            />
          ))}
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
