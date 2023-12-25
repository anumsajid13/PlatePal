import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Chef/pages/chefProfile.css'
import useTokenStore from '../../tokenStore';
import ChefGenericPopup from '../../Chef/components/ChefGenericPopup';
import NutNav from '../components/N-Nav';

const ChefProfile1 = () => {

//     const navigate = useNavigate();
//     const [nut, setN] = useState({});
//     const [editMode, setEditMode] = useState(false);
//     const [profilePictureFile, setProfilePictureFile] = useState(null);
//     const [showPopup, setShowPopup] = useState(false);
//     const [popupMessage, setPopupMessage] = useState('');

//     const { token, setToken } = useTokenStore(); 

//     const handleClosePopup = () => {
//         setShowPopup(false);
//         navigate('/');
//     };

    
//     //function to handle profile picture change
//     const handleProfilePictureChange = (event) => {
//         const file = event.target.files[0];
//         setProfilePictureFile(file);
//     };
    
//     console.log(token)
//     useEffect(() => {
//         fetchChefData();
//     }, []);

//     const fetchChefData = async () => {
//         try {
//           const response = await fetch('http://localhost:9000/n/get', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`,
//             },
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to fetch Nutrionist data');
//           }
    
//           const data = await response.json();
//           console.log(data)
//           setN(data);
//         } catch (error) {
//           console.error(error);
//         }
//       };
    
//       const handleEdit = () => {
//         setEditMode(true);
//       };
    
//       const handleSave = async (e) => {
//         e.preventDefault();

//         const formData = new FormData();
//         formData.append('profilePicture', profilePictureFile); 
//         formData.append('name', nut.name); 
//         formData.append('email', nut.email);
//         formData.append('username', nut.username);
//         formData.append('oldpassword', nut.oldpassword);
//         formData.append('newpassword', nut.newpassword);

//         try {
//           const response = await fetch('http://localhost:9000/n/update', {
//             method: 'PUT',
//             headers: {
              
//               Authorization: `Bearer ${token}`, 
//             },
//             body: formData, 
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to update Nutrionist data');
//           }
    
          
//           fetchChefData();
//         } catch (error) {
//           console.error(error);
//         }finally {
//             setEditMode(false); 
//           }
//       };
    
//       const handleDelete = async () => {
//         try {
//           const response = await fetch('http://localhost:9000/n/delete', {
//             method: 'DELETE',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${token}`, 
//             },
//           });
    
//           if (!response.ok) {
//             throw new Error('Failed to delete  Nutrionist');
//           }
          
//           setPopupMessage('Your Account deleted successfully !');
//           setShowPopup(true);
          
         
//         } catch (error) {
//           console.error(error);
//         }
//       };
    
//       const handleChange = (e) => {
//         const { name, value } = e.target;
//         setN({ ...nut, [name]: value });
//       };
      
//     return(

//         <>
//             <NutNav/>
//             <h2 className='chef-profile-heading'>My Profile</h2>
//              <div className='chef-profile-container'>
//                 {editMode ? (
//                     <form className='chef-profile-form-editable'>
//                 <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                     Profile Picture:
//                     <input 
//                         type="file"
//                         accept="image/*"
//                         onChange={handleProfilePictureChange}
//                     />
//                     </label>
//                 </div>
//                  <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                         Name:
//                         <input className='chef-profile-inpuut-editable'
//                         type="text"
//                         name="name"
//                         value={nut.name}
//                         onChange={handleChange}
//                         />
//                     </label>
//                 </div>
//                 <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                         Email:  
//                         <input className='chef-profile-inpuut-editable'
//                         type="text"
//                         name="email"
//                         value={nut.email}
//                         onChange={handleChange}
//                         />
//                     </label>
//                 </div>
//                 <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                         Username:  
//                         <input className='chef-profile-inpuut-editable'
//                         type="text"
//                         name="username"
//                         value={nut.username}
//                         onChange={handleChange}
//                         />
//                     </label>
//                 </div>
//                 <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                         Old Password:  
//                         <input className='chef-profile-inpuut-editable'
//                         type="text"
//                         name="oldpassword"
//                         value={nut.oldpassword}
//                         onChange={handleChange}
//                         />
//                     </label>
//                 </div>
//                 <div className='chef-profile-unifromdistance'>
//                     <label className='chef-profile-label-editable'>
//                         New Password:  
//                         <input className='chef-profile-inpuut-editable'
//                         type="text"
//                         name="newpassword"
//                         value={nut.newpassword} 
//                         onChange={handleChange}
//                         />
//                     </label>
//                 </div>  
//                     <button className='chef-profile-buttonss' type="button" onClick={handleSave}>Save</button>
//                     </form>
//                 ) : (
//                     <div className='chef-profile-form-editable'>
                    
//                     <div className="chef-profile-text-wrapper">
//                         <div className="chef-profile-image-wrapper">
//                             <img className='chef-profile-imagee'
//                                 src={nut.profilePicture ? `data:image/jpeg;base64,${nut.profilePicture}` : require('../assets/images/no-profile-picture-15257.svg').default} 
//                             />
//                         </div>
//                         <div className="chef-profile-three-textt-wrapper">
//                             <p className='chef-profile-p-editable'><p className='chef-profile-label-editable'>Name:</p> {nut.name}</p>
//                             <p className='chef-profile-p-editable'><p className='chef-profile-label-editable'>Email:</p> {nut.email}</p>
//                             <p className='chef-profile-p-editable'><p className='chef-profile-label-editable'>Username:</p> {nut.username}</p>
//                         </div>
//                     </div>
//                     <button className='chef-profile-buttonss' onClick={handleEdit}>Edit</button>
//                     <button className='chef-profile-buttonss' onClick={handleDelete}>Delete</button>
//                     </div>
//                 )}
//             </div>
            
//             {showPopup && (
//                 <ChefGenericPopup message={popupMessage} onClose={handleClosePopup} />
//             )}

//         </>

//     );


 };

export default ChefProfile1;