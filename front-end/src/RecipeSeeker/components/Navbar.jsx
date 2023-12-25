// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import './Navbar-1.css';
import './NotificationBox.css';
import NotificationBox from './NotificationBox';
import  useTokenStore  from  '../../tokenStore.js'
import { jwtDecode } from 'jwt-decode';


const Navbar = ({ activeLink }) => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = useTokenStore((state) => state.token);
  const decodedToken = jwtDecode(token); 
  const currentUserId = decodedToken.id;

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("TOGGLE");
    console.log(activeLink);
  };
  
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {
    
    fetch(`http://localhost:9000/recepieSeeker/notifications/${currentUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNotifications(data);
        console.log("notification data",data);
      })
      .catch((error) => console.error('Error fetching notifications:', error));
  }, []);

  return (
    <nav className="navbar-1">
      <div className="logo">Plate Pal</div>
      <div className="nav-links-1">
        <Link
          to="http://localhost:3000/recipe-seeker/Discover"
          className={activeLink === 'Discover' ? 'active-link-1' : ''}
        >
          Discover
        </Link>
        <Link to="/my-feed" className={activeLink === 'My Feed' ? 'active-link-1' : ''}>
          My Feed
        </Link>
            
        <div className="notification-icon" onClick={toggleNotifications}>
          <span className="material-icons">notifications</span>
          {showNotifications && <div className="notification-arrow" />}
        </div>
          <span className="material-icons google-icon" style={{cursor:"pointer"}}>logout</span>
          <span class="material-icons google-icon icon-link-1"  onClick={toggleSidebar}>menu</span>
          
      </div>
      
      <div className={`sidebar1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Link to="/recipe-seeker/Consult_Nutritionist">Consult Nutritionists</Link>
        <Link to="/recipe-seeker/Inbox" >Inbox</Link>
        <Link to="">My Bookmark</Link>
        <Link to="">My Followings</Link>
        <Link to="/recipe-seeker/UpdateProfile">Edit Profile</Link>
       
      </div>
     
      {showNotifications && (
        <NotificationBox notifications={notifications} onClose={toggleNotifications} />
      )}
    </nav>
  );
};

export default Navbar;
