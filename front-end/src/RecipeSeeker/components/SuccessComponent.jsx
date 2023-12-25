// SuccessComponent.jsx
import React, { useEffect } from 'react';
import './sucess.css';
import Navbar from './Navbar';
import useTokenStore from '../../tokenStore';

const SuccessComponent = () => {
  const token = localStorage.getItem('token');
  const { setToken } = useTokenStore();

  // Use useEffect to set the token only once when the component mounts
  useEffect(() => {

    console.log("Token: ",token)
    setToken(token);
  }, [setToken, token]); // Add setToken and token to the dependency array

  return (
    <div style={{backgroundColor:"white",minHeight: "100vh"}} >
      <Navbar activeLink="Discover" />
      <div className="success-container" style={{"marginTop":"12%"}}>
        <img src="https://i.gifer.com/7efs.gif" alt="Success" className="success-gif" />
        <h1 className="success-message">Payment was successful!</h1>
      </div>
    </div>
  );
};

export default SuccessComponent;
