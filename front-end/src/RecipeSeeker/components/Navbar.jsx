// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { React, useState, useEffect } from 'react';
import './Navbar-1.css';
import './NotificationBox.css';
import NotificationBox from './NotificationBox';
import  useTokenStore  from  '../../tokenStore.js'
import { jwtDecode } from 'jwt-decode';
import useCartStore from './cartStore'; 
import CartPopup from './CartPopup';



const Navbar = ({ activeLink }) => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
 // const token = useTokenStore((state) => state.token);
  const token = localStorage.getItem('token');
  const { setToken } = useTokenStore();
  const decodedToken = jwtDecode(token); 
  const currentUserId = decodedToken.id;
  const toggleCartPopup = useCartStore((state) => state.toggleCartPopup);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    console.log("TOGGLE");
    console.log(activeLink);
  };
  
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  useEffect(() => {

    setToken(token);
    
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
  }, [setToken, token]);

  
  const handleCartClick = () => {
    toggleCartPopup();
  };

  const cartItemsCount = useCartStore((state) => state.cartItems.length);

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:9000/recepieSeeker/deletenotifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }

      const updatedNotifications = notifications.filter((notification) => notification._id !== id);
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="navbar-1">
      <div className="logo">Plate Pal</div>
      <div className="nav-links-1">
        <Link
          to="http://localhost:3000/recipe-seeker/Discover"
          className={activeLink === 'Discover' ? 'active-link-12' : ''}
        >
          Discover
        </Link>
       

        <span style={{cursor:"pointer"}} className="icon material-icons google-icon" onClick={handleCartClick}>shopping_cart</span>
        {cartItemsCount > 0 && <div className="cart-counter">{cartItemsCount}</div>}
            
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
        <NotificationBox notifications={notifications} onClose={toggleNotifications} handleDeleteNotification={handleDeleteNotification} />
      )}

      {useCartStore((state) => state.isCartPopupOpen) && (
              <CartPopup onClose={toggleCartPopup}  />
      )}
    </nav>
  );
};

export default Navbar;
