import React, { useState, useEffect } from 'react';
import './chefProfile.css'
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';

const ChefProfile = () => {

    const [chef, setChef] = useState({});
    const [editMode, setEditMode] = useState(false);

    const { token, setToken } = useTokenStore(); 
    
    console.log(token)
    useEffect(() => {
        fetchChefData();
    }, []);

    const fetchChefData = async () => {
        try {
          const response = await fetch('http://localhost:9000/chef/get', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to fetch Chef data');
          }
    
          const data = await response.json();
          console.log(data)
          setChef(data);
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleEdit = () => {
        setEditMode(true);
      };
    
      const handleSave = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:9000/chef/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify(chef),
          });
    
          if (!response.ok) {
            throw new Error('Failed to update Chef data');
          }
    
          
          fetchChefData();
        } catch (error) {
          console.error(error);
        }finally {
            setEditMode(false); 
          }
      };
    
      const handleDelete = async () => {
        try {
          const response = await fetch('http://localhost:9000/chef/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, 
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to delete Chef data');
          }
    
         
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setChef({ ...chef, [name]: value });
      };
      
    return(

        <>
            <ChefNav/>

             <div>
                {editMode ? (
                    <form>
                    <label>
                        Name:
                        <input
                        type="text"
                        name="name"
                        value={chef.name}
                        onChange={handleChange}
                        />
                    </label>
                    <label>
                        Email:  
                        <input
                        type="email"
                        name="email"
                        value={chef.email}
                        onChange={handleChange}
                        />
                    </label>
                   
                    <button type="button" onClick={handleSave}>Save</button>
                    </form>
                ) : (
                    <div>
                    <p>Name: {chef.name}</p>
                    <p>Email: {chef.email}</p>
                  
                    <button onClick={handleEdit}>Edit</button>
                    <button onClick={handleDelete}>Delete</button>
                    </div>
                )}
            </div>
            

        </>

    );


};

export default ChefProfile;