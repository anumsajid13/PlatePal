import React, { useState, useEffect } from 'react';
import '../../Chef/pages/chefFollowers.css';
import useTokenStore from '../../tokenStore';
import NutNav from '../components/N-Nav';
import { BASE_URL } from '../../url';

const ChefDisplayFollowers = () => {
    const [followers, setFollowers] = useState([]);
    const { token, setToken } = useTokenStore(); 

    useEffect(() => {
       
        const fetchFollowers = async () => {
            try {
                const response = await fetch(`${BASE_URL}/n/myfollowers`, {
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
                console.log(data)
                setFollowers(data.followers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchFollowers();
    }, []);

    return (
        <>
            <NutNav />
            <div className="chef-followers-list">
                <h2 className='chef-follower-heading'>My Followers</h2>
                <div className='chef-followers-list-item'>
                    {followers.map((follower, index) => (
                        <div className="chef-followers-names"  key={index}><p className='chef-followers-names-text'>{follower.name}</p>
                        <img className="chef-followers-image" src={follower.profilePicture ? follower.profilePicture : require('../../Chef/assets/images/no-profile-picture-15257.svg').default} alt="Profile" />
                        </div>
                        
                    ))}
                </div>
            </div>
        </>
    );

};

export default ChefDisplayFollowers;