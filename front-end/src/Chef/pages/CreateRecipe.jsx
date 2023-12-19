import  {React, useEffect, useState } from 'react';
import ChefNav from '../components/NavBarChef';
import './createRecipe.css'; 
import useTokenStore from '../../tokenStore';


const CreateRecipe = () => {

    const { token, setToken } = useTokenStore(); 

    console.log(token)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        calories: '',
        servingSize: '',
        difficulty: '',
        totalTime: '',
        ingredients: [],
        allergens: [],
        notDelivered: [],
        utensils: [],
        category: [],
        instructions: [],
        recipeImage: null,
      });

      const [showSuccessPopup, setShowSuccessPopup] = useState(false);

      const handleArrayFieldChange = (field, index, e) => {
        const { value } = e.target;
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData(prevState => ({
          ...prevState,
          [field]: newArray,
        }));
      };

      const addArrayField = (field) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: [...prevState[field], ''],
          }));
      };
    
      const removeArrayField = (field, index) => {
        const newArray = [...formData[field]];
        newArray.splice(index, 1);
        setFormData(prevState => ({
            ...prevState,
            [field]: newArray,
        }));
      };

      const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const newIngredients = [...formData.ingredients];
        newIngredients[index][name] = value;
        setFormData(prevState => ({
            ...prevState,
            ingredients: newIngredients,
        }));
      };

      const addIngredient = () => {
        setFormData(prevState => ({
          ...prevState,
          ingredients: [...prevState.ingredients, { name: '', quantity: '' }],
        }));
      };
      
      
      const removeIngredient = (index) => {
        setFormData(prevState => {
          const newIngredients = [...prevState.ingredients];
          newIngredients.splice(index, 1);
          return {
            ...prevState,
            ingredients: newIngredients,
          };
        });
      };
      
      const handleSuccessPopup = () => {
        setShowSuccessPopup(true);
      };
    
      const handlePopupClose = () => {
        setShowSuccessPopup(false);
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
            const numericValue = name === 'calories' || name === 'servingSize' || name === 'totalTime' ? parseInt(value, 10) : value;
            setFormData(prevState => ({
                ...prevState,
                [name]: numericValue,
            }));
      };

      const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            recipeImage: file,
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Token:', token);

        try {
            const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'recipeImage' && key !== 'ingredients') {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formDataToSend.append(key, JSON.stringify(item));
          });
        } else {
          formDataToSend.append(key, JSON.stringify(value));
        }
      }
    });

    // Append ingredients as an array of objects
    formData.ingredients.forEach((ingredient, index) => {
      formDataToSend.append(`ingredients[${index}][name]`, ingredient.name);
      formDataToSend.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    formDataToSend.append('recipeImage', formData.recipeImage);
          const response = await fetch('http://localhost:9000/recipes/newRecipe', {
            method: 'POST',
            headers: {
                
                Authorization: `Bearer ${token}`, 
              },
              body: formDataToSend,
          });
          if (!response.ok) {
            const data = await response.json();
            console.error('Error:', data.message);
           
          } else {
            const data = await response.json();
            console.log('Recipe created:', data);
            
            setShowSuccessPopup(true);

            //reset form data to initial state after successful creation
            setFormData({
                title: '',
                description: '',
                calories: '',
                servingSize: '',
                difficulty: '',
                totalTime: '',
                ingredients: [],
                allergens: [],
                notDelivered: [],
                utensils: [],
                category: [],
                instructions: [],
                recipeImage: null,
            });
          }
        } catch (error) {
          console.error('Error:', error.message);
          // Handle any other error scenarios in UI
        }
      };

    return (

        <>
            <ChefNav/>
            <div className="create-recipe-container">
                <h2 className='create-recipe-heading2'>Create Recipe</h2>
                <form className='create-recipe-form' >
                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="title">Title</label>
                        <input className='create-recipe-input' type="text" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="enter recipe name" />
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="description">Description</label>
                        <input className='create-recipe-input' type="text" id="description" name="description" value={formData.description} onChange={handleChange} placeholder="enter description" />
                    </div>


                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="calories">Calories</label>
                        <input className='create-recipe-input' type="text" id="calories" name="calories" value={formData.calories} onChange={handleChange} placeholder="enter calories" />
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="servingSize">Serving Size</label>
                        <input className='create-recipe-input' type="text" id="servingSize" name="servingSize" value={formData.servingSize} onChange={handleChange} placeholder="enter serving size" />
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="difficulty">Difficulty</label>
                        <input className='create-recipe-input' type="text" id="difficulty" name="difficulty" value={formData.difficulty} onChange={handleChange} placeholder="enter difficulty" />
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="totalTime">Total Time</label>
                        <input className='create-recipe-input' type="text" id="totalTime" name="totalTime" value={formData.totalTime} onChange={handleChange} placeholder="enter total cooking time" />
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="ingredients">Ingredients</label>
                        {formData.ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                name='name'
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, e)}
                                placeholder='Ingredient name'
                                />
                                <input className='create-recipe-input'
                                type='text'
                                name='quantity'
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, e)}
                                placeholder='Quantity'
                                />
                                <button className='create-recipe-button' onClick={() => removeIngredient(index)}>Remove</button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addIngredient()} type="button">Add Ingredient</button>
                      
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="allergens">Allergens</label>
                        {formData.allergens.map((item, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                value={item}
                                onChange={(e) => handleArrayFieldChange('allergens', index, e)}
                                placeholder='Enter allergen'
                                />
                                <button className='create-recipe-button' onClick={() => removeArrayField('allergens', index)}>
                                Remove
                                </button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addArrayField('allergens')}type="button" >Add Allergen</button>
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="notDelivered">Not Delivered</label>
                        {formData.notDelivered.map((item, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                value={item}
                                onChange={(e) => handleArrayFieldChange('notDelivered', index, e)}
                                placeholder='Enter not delivered items'
                                />
                                <button className='create-recipe-button' onClick={() => removeArrayField('notDelivered', index)}>
                                Remove
                                </button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addArrayField('notDelivered')} type="button">Add Not Delieverd</button>
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="utensils">Utensils</label>
                        {formData.utensils.map((item, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                value={item}
                                onChange={(e) => handleArrayFieldChange('utensils', index, e)}
                                placeholder='Enter utensils'
                                />
                                <button className='create-recipe-button' onClick={() => removeArrayField('utensils', index)}>
                                Remove
                                </button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addArrayField('utensils')} type="button">Add Utensils</button>
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="category">Category</label>
                        {formData.category.map((item, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                value={item}
                                onChange={(e) => handleArrayFieldChange('category', index, e)}
                                placeholder='Enter category'
                                />
                                <button className='create-recipe-button' onClick={() => removeArrayField('category', index)}>
                                Remove
                                </button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addArrayField('category')} type="button">Add Category</button>
                    </div>

                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="instructions">Instructions</label>
                        {formData.instructions.map((item, index) => (
                            <div key={index}>
                                <input className='create-recipe-input'
                                type='text'
                                value={item}
                                onChange={(e) => handleArrayFieldChange('instructions', index, e)}
                                placeholder='Enter instructions'
                                />
                                <button className='create-recipe-button' onClick={() => removeArrayField('instructions', index)}>
                                Remove
                                </button>
                            </div>
                        ))}
                            <button className='create-recipe-button' onClick={() => addArrayField('instructions')} type="button">Add Instructions</button>
                    </div>
                    
                    <div className='create-recipe-inputlabel'>
                        <label className='create-recipe-label' htmlFor="recipeImage">Recipe Image</label>
                        <input className='create-recipe-input' type="file" id="recipeImage" name="recipeImage" onChange={handleImageChange} />
                    </div>
                    
                    <button className='create-recipe-button'  onClick={handleSubmit} type="submit">Create Recipe</button>
                </form>

             </div>
            
            {/* Success Popup */}
                {showSuccessPopup && (
                    <div className="success-popup">
                    <p>Recipe Created Successfully!</p>
                    <button className="popup-button" onClick={handlePopupClose}>
                        Directed to Vendors Page to Send Collab Request
                    </button>
                    </div>
                )}

        </>
    
    );

};


export default CreateRecipe;