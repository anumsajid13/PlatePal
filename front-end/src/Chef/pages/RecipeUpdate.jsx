import {React , useState} from 'react';
import useTokenStore from '../../tokenStore';
import { BASE_URL } from '../../url';

const RecipeUpdateModal = ({ selectedRecipe, onClose, onUpdate}) => {
    console.log(selectedRecipe)

    //const { token, setToken } = useTokenStore(); 

    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        title: selectedRecipe.title, 
        description: selectedRecipe.description, 
        calories: selectedRecipe.calories, 
        servingSize: selectedRecipe.servingSize,
        difficulty: selectedRecipe.difficulty, 
        totalTime: selectedRecipe.totalTime,
        price: selectedRecipe.price, 
        ingredients: selectedRecipe.ingredients,
        allergens: selectedRecipe.allergens,
        notDelivered: selectedRecipe.notDelivered,
        utensils: selectedRecipe.utensils,
        category: selectedRecipe.category,
        instructions: selectedRecipe.instructions,
        recipeImage: null,
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            recipeImage: file,
        }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
           
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('calories', formData.calories);
            formDataToSend.append('servingSize', formData.servingSize);
            formDataToSend.append('difficulty', formData.difficulty);
            formDataToSend.append('totalTime', formData.totalTime);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);

            formData.ingredients.forEach((ingredient, index) => {
                formDataToSend.append(`ingredients[${index}][name]`, ingredient.name);
                formDataToSend.append(`ingredients[${index}][quantity]`, ingredient.quantity);
            });

            formData.allergens.forEach((allergen, index) => {
                formDataToSend.append(`allergens[${index}]`, allergen);
            });

            formData.notDelivered.forEach((item, index) => {
                formDataToSend.append(`notDelivered[${index}]`, item);
            });

            formData.utensils.forEach((utensil, index) => {
                formDataToSend.append(`utensils[${index}]`, utensil);
            });

            formData.instructions.forEach((instruction, index) => {
                formDataToSend.append(`instructions[${index}]`, instruction);
            });

            formDataToSend.append('recipeImage', formData.recipeImage);

            const response = await fetch(`${BASE_URL}/recipes/update/${selectedRecipe._id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            onClose();

            if (!response.ok) {
                const data = await response.json();
                console.error('Error:', data.message);
            } else {
                console.log(response)
                setShowSuccessPopup(true);
                onUpdate();
            }
        } catch (error) {
            console.error('Error:', error.message);
            
        }
    };
    return (
        <>
            <div  className="chef-recipe-popup-container">
            <div style={{background: '#eff5f2'}} className="chef-recipe-popup">
                    <button className="updatepop-chef-pop-close-btn" onClick={onClose} >
                        <span className="material-icons">close</span>
                    </button>

                <div className="chef-recipe-image-container">

                    
                    <h2 className='reportt-heading'>Update Recipe</h2>
                    <form >
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
                        <label className='create-recipe-label' htmlFor="price">Price</label>
                        <input className='create-recipe-input' type="text" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="enter price " />
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

                        <input type="file" name="recipeImage" onChange={handleImageChange} />
                        <button className='create-recipe-button'  onClick={handleSubmit} type="button">Update Recipe</button>
                    </form>
                    
                </div>
      
            </div>
            </div>
        
        </>
    );
};

export default RecipeUpdateModal;
