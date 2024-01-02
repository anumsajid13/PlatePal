import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';
import '../pages/chefMainPage.css';
import RecipePopUpChef from '../components/RecipePopUpChef';
import RecipeUpdateModal from './RecipeUpdate'
import { BASE_URL } from '../../url';


const ChefMainPage = () => {

   
   // const { token, setToken } = useTokenStore(); 

    const token = localStorage.getItem('token');

    console.log(token);


    const [recipesWithVendor, setRecipesWithVendor] = useState([]);
    const [recipesWithoutVendor, setRecipesWithoutVendor] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [updateselectedRecipe, setupdateselectedRecipe] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRecipeUpdate = (recipe) => {
       console.log(recipe)
        setupdateselectedRecipe(recipe);
        setShowUpdateModal(true);
    };

    const handleCloseModal = () => {
        setupdateselectedRecipe(null);
        setShowUpdateModal(false);
    };

    const fetchData = async () => {
        try {
           
            //fetch recipes with a vendor collaboration
            const responseWithVendor = await fetch(`${BASE_URL}/recipes/myrecipes/vendors/${searchTerm}`,  {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                  }
                 
              });
            if (!responseWithVendor.ok) {
                throw new Error('Failed to fetch recipes with vendor collaboration');
            }
            const dataWithVendor = await responseWithVendor.json();
            console.log(dataWithVendor);
            setRecipesWithVendor(dataWithVendor);
            

            //fetch recipes without a vendor collaboration
            const responseWithoutVendor = await fetch(`${BASE_URL}/recipes/myrecipes/noVendor/${searchTerm}`,  {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                  }
                 
              });
            if (!responseWithoutVendor.ok) {
                throw new Error('Failed to fetch recipes without vendor collaboration');
            }
            const dataWithoutVendor = await responseWithoutVendor.json();
            setRecipesWithoutVendor(dataWithoutVendor);
           
        } catch (error) {
            // Handle error
            console.error('Error:', error.message);
        }
    };


    useEffect(() => {
        
        fetchData();
    }, [searchTerm]);

    const handleRecipeDeletion = (deletedRecipeId) => {
        //filter out the deleted recipe from both recipe lists
        const updatedRecipesWithVendor = recipesWithVendor.filter(recipe => recipe._id !== deletedRecipeId);
        const updatedRecipesWithoutVendor = recipesWithoutVendor.filter(recipe => recipe._id !== deletedRecipeId);

        setRecipesWithVendor(updatedRecipesWithVendor);
        setRecipesWithoutVendor(updatedRecipesWithoutVendor);
    };

    
    const handleRecipeUpdateinmain = async () => {
        
        await fetchData();
    };

    

    function truncateText(text, limit) {
        if (text) {
        const words = text.split(' ');
        if (words.length > limit) {
          return words.slice(0, limit).join(' ') + '...';
        }
        return text;
      }
      return '';
      }

    return (

        <>
            <ChefNav/>

            <div className="discover-container-1">
                <div style={{background:'#ffe853'}} className="search-card-11">
                    <input 
                    style={{marginLeft: '19%'}}
                    className='searchRecepie' 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="material-icons google-icon">search</span>
                </div>
            </div>
           {/* Display recipes with vendor collaboration */}
            <div className='chef-recipe-card-with-vc'>
                <h2 className='chef-recipe-card-with-vc-heading'>Recipes with Vendor Collaboration</h2>
                {recipesWithVendor.length > 0 ? (
                    <div className="recipe-cards-chef">
                        {recipesWithVendor.map(recipe => (
                         <div>
                            <div className="recipe-card-chef" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
                                <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  className="recipe-image-chef" />
                                <div className="recipe-details-chef">
                                    <h3>{recipe.title.replace(/"/g, '')}</h3>
                                    <p>by Chef {recipe.chefName}</p>
                                    <p className='recipe-card-chef-description'>{truncateText(recipe.description.replace(/"/g, ''), 20 )}</p>
                                   
                                </div>
                            </div>
                            <button className='recipe-update-buttonn' onClick={() => handleRecipeUpdate(recipe)}>Update</button>
                        </div>
                        ))}
                    </div>
                ) : (
                    <p className='textt'>No recipes with vendor collaboration</p>
                )}
            </div>

            {/* Display recipes without vendor collaboration */}
            <div className='chef-recipe-card-without-vc'>
                <h2 className='chef-recipe-card-without-vc-heading'>Recipes without Vendor Collaboration</h2>
                {recipesWithoutVendor.length > 0 ? (
                    <div className="recipe-cards-chef">
                        {recipesWithoutVendor.map(recipe => (
                        <div>
                            <div className="recipe-card-chef" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
                                <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  className="recipe-image-chef" />
                                <div className="recipe-details-chef">
                                    <h3>{recipe.title.replace(/"/g, '')}</h3>
                                    <p>by Chef {recipe.chefName.replace(/"/g, '')}</p>
                                    <p className='recipe-card-chef-description'>{truncateText(recipe.description.replace(/"/g, ''), 20 )}</p>
                                </div>
                            </div>
                            <button className='recipe-update-buttonn' onClick={() => handleRecipeUpdate(recipe)}>Update</button>
                        </div> 
                        ))}
                    </div>
                ) : (
                    <p className='textt'>No recipes without vendor collaboration</p>
                )}
            </div>

             {selectedRecipe && (
                <RecipePopUpChef
                    selectedRecipe={selectedRecipe}
                    setSelectedRecipe={setSelectedRecipe}
                    onDelete={handleRecipeDeletion} 
                />
            )}

            {showUpdateModal && updateselectedRecipe && (
                <RecipeUpdateModal selectedRecipe={updateselectedRecipe} onClose={handleCloseModal} onUpdate={handleRecipeUpdateinmain}  />
            )}

        </>
    
    );

};


export default ChefMainPage;