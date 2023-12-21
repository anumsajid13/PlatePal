import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';
import '../pages/chefMainPage.css';
import RecipePopUpChef from '../components/RecipePopUpChef';


const ChefMainPage = () => {

   
    const { token, setToken } = useTokenStore(); 

    console.log(token);

    const [recipesWithVendor, setRecipesWithVendor] = useState([]);
    const [recipesWithoutVendor, setRecipesWithoutVendor] = useState([]);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
               
                //fetch recipes with a vendor collaboration
                const responseWithVendor = await fetch('http://localhost:9000/recipes/myrecipes/vendors',  {
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
                const responseWithoutVendor = await fetch('http://localhost:9000/recipes/myrecipes/noVendor',  {
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

        fetchData();
    }, []);

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

           {/* Display recipes with vendor collaboration */}
            <div className='chef-recipe-card-with-vc'>
                <h2 className='chef-recipe-card-with-vc-heading'>Recipes with Vendor Collaboration</h2>
                {recipesWithVendor.length > 0 ? (
                    <div className="recipe-cards-chef">
                        {recipesWithVendor.map(recipe => (
                            <div className="recipe-card-chef" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
                                <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  className="recipe-image-chef" />
                                <div className="recipe-details-chef">
                                    <h3>{recipe.title.replace(/"/g, '')}</h3>
                                    <p>by Chef {recipe.chefName}</p>
                                    <p className='recipe-card-chef-description'>{truncateText(recipe.description.replace(/"/g, ''), 20 )}</p>
                                </div>
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
                            <div className="recipe-card-chef" key={recipe._id} onClick={() => setSelectedRecipe(recipe)}>
                                <img src={`data:image/jpeg;base64,${recipe.recipeImage.data}`}  className="recipe-image-chef" />
                                <div className="recipe-details-chef">
                                    <h3>{recipe.title}</h3>
                                    <p>by Chef {recipe.chefName.replace(/"/g, '')}</p>
                                    <p className='recipe-card-chef-description'>{truncateText(recipe.description.replace(/"/g, ''), 20 )}</p>
                                </div>
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
                />
            )}

        </>
    
    );

};


export default ChefMainPage;