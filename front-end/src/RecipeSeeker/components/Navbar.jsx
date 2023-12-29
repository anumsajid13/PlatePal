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
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogout = async () => {
   
      // Show loading animation
      setIsLoading(true);

      setTimeout( async() => {
       
        try {
          const response = await fetch(`http://localhost:9000/recepieSeeker/logout`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            
          });
          if (!response.ok) {
            throw new Error('Failed to logout');
          }
    
         
          localStorage.removeItem('token');
    
          
          // Redirect to the homepage
          navigate('/');
    
        } catch (error) {
          console.error('Logout error:', error);
        }
      }, 4000); 
     
  };

  return (
    <nav className="navbar-1">

        {isLoading && (
                <div className="chef-overlay">
                <div className="chef-spinner"></div>
                  <span className="loading-text">Logging out...</span>
                </div>
              )}
      <div className="logo">Plate Pal</div>
      <div className="nav-links-1">
        <Link
          to="http://localhost:3000/recipe-seeker/Discover"
          className={activeLink === 'Discover' ? 'active-link-12' : 'nolink'}
        >
          Discover
        </Link>

        <Link
          to="http://localhost:3000/recipe-seeker/Favourites"
          className={activeLink === 'Favourites' ? 'active-link-12' : 'nolink'}
        >
        My Favourites
        </Link>
       

        <span style={{cursor:"pointer"}} className="icon material-icons google-icon" onClick={handleCartClick}>shopping_cart</span>
        {cartItemsCount > 0 && <div className="cart-counter">{cartItemsCount}</div>}
            
        <div className="notification-icon" onClick={toggleNotifications}>
          <span className="material-icons">notifications</span>
          {showNotifications && <div className="notification-arrow" />}
        </div>
          
          <span className="material-icons google-icon" style={{cursor:"pointer"}} onClick={handleLogout}>logout</span>
          <span class="material-icons google-icon icon-link-1"  onClick={toggleSidebar}>menu</span>
          
      </div>
      
      <div className={`sidebar1 ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Link to="/recipe-seeker/Consult_Nutritionist">Consult Nutritionists</Link>
        <Link to="/recipe-seeker/Inbox" >Inbox</Link>
        <Link to="/recipe-seeker/TransactionHistory">Transaction History</Link>
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
