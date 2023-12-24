import React, { useState, useEffect } from 'react';
import './chefFollowers.css';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';

const ChefDisplayFollowers = () => {
    const [followers, setFollowers] = useState([]);
    const { token, setToken } = useTokenStore(); 

    useEffect(() => {
        // Fetch followers' names
        const fetchFollowers = async () => {
            try {
                const response = await fetch('http://localhost:9000/chef/myfollowers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch followers');
                }

                const data = await response.json();
                setFollowers(data.followers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFollowers();
    }, []);

    return (
        <>
            <ChefNav />
            <div className="followers-list">
                <h2>Followers</h2>
                <ul>
                    {followers.map((follower, index) => (
                        <li key={index}>{follower.name}</li>
                    ))}
                </ul>
            </div>
        </>
    );

};

export default ChefDisplayFollowers;