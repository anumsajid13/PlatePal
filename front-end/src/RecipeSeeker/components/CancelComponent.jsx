// CancelComponent.jsx

import React from 'react';
import Navbar from './Navbar';
import { BASE_URL } from '../../url';

import './sucess.css';

const CancelComponent = () => {
  return (

    <>
    <Navbar activeLink="Discover" />
    <div className="cancel-container">
      <img src='https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.iconsdb.com%2Ficons%2Fdownload%2Fred%2Fexclamation-multi-size.ico&tbnid=ci9kC74wxpZvgM&vet=12ahUKEwiO1vul66qDAxWyV6QEHQiECvQQMygHegQIARBl..i&imgrefurl=https%3A%2F%2Fwww.iconsdb.com%2Fred-icons%2Fexclamation-icon.html&docid=JOo9rfqfHaj_cM&w=256&h=256&q=exclamation%20error%20%20gif%20download&ved=2ahUKEwiO1vul66qDAxWyV6QEHQiECvQQMygHegQIARBl' alt="Cancel" className="cancel-gif" />
      <p className="cancel-message">Payment was not successful</p>
    </div>
    </>
   
  );
};

export default CancelComponent;
