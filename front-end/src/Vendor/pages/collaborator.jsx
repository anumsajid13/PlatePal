import React, { useState, useEffect } from 'react';
import '../../Chef/pages/chefFollowers.css';
import   NavigationBar from '../components/NavigationBar';
import useTokenStore from '../../tokenStore';
import { BASE_URL } from '../../url';
const VendorCollaborators = () => {
    const [collaborators, setCollaborators] = useState([{}]);
    const { token} = useTokenStore(); 

    useEffect(() => {
       
        const fetchCollaborators = async () => {
            try {
                const response = await fetch(`${BASE_URL}/collaboration/mycollaborators`, {
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
                setCollaborators(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCollaborators();
    }, []);

    return (
        <>
            < NavigationBar />
            <div className="chef-followers-list">
                <h2 className='chef-follower-heading'>My Collaborators</h2>
                {collaborators.length === 0 ? (
    <div className='chef-followers-list-item'>
        <p style={{ marginLeft: '45%' }}>No collaborators yet</p>
    </div>
) : (
    <div className='chef-followers-list-item'>
        {collaborators.map((collaborator, index) => (
            <div className="chef-followers-names" key={index}>
                <p className='chef-followers-names-text'>{collaborator.chef?.name}</p>
                <img
                    className="chef-followers-image"
                    src={collaborator.chef?.profileImage ? collaborator.chef.profileImage : require('../assets/images/no-profile-picture-15257.svg').default}
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

export default VendorCollaborators;