import React, { useState, useEffect } from 'react';
import './chefFollowers.css';
import ChefNav from '../components/NavBarChef';
import useTokenStore from '../../tokenStore';

const ChefDisplayFollowers = () => {
    const [followers, setFollowers] = useState([]);
    const { token, setToken } = useTokenStore(); 

    useEffect(() => {
       
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
            <ChefNav />
            <div className="chef-followers-list">
                <h2 className='chef-follower-heading'>My Followers</h2>
                {followers.length === 0 ? (
                    <div className='chef-followers-list-item'>
                    <p style={{marginLeft: '45%'}}>No followers yet</p>
                    </div>
                ) : (
                    <div className='chef-followers-list-item'>
                        {followers.map((follower, index) => (
                            <div className="chef-followers-names" key={index}>
                                <p className='chef-followers-names-text'>{follower.name}</p>
                                <img
                                    className="chef-followers-image"
                                    src={follower.profilePicture ? follower.profilePicture : require('../assets/images/no-profile-picture-15257.svg').default}
                                    alt="Profile"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );

};

export default ChefDisplayFollowers;