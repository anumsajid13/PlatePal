//App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landingpage';
import Adminmain from './Admin/pages/main_admin';
import SignUpPage from './SignUp'; 
import SignInPage from './SignIn'; 
import RecipeSeekerSignUp from './RecipeSeeker/components/SignUp_RecepieSeeker';
import DiscoverPage from './RecipeSeeker/components/Discover';
import ChefSignUp from './Chef/pages/ChefSignUp';
import VendorSignUp from './Vendor/pages/SignUp_vendor';
import VendorMainpage from './Vendor/pages/VendorMainpage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<Adminmain/>} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup/recipe-seeker" element={<RecipeSeekerSignUp />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/recipe-seeker/Discover" element={<DiscoverPage />} />
        <Route path="/signup/chef" element={<ChefSignUp/>}/>
        <Route path="/signup/vendor" element={<VendorSignUp/>}/>
        <Route path="/Vendor/Mainpage" element={<VendorMainpage />} />
     

      </Routes>
    </div>
  );
}

export default App;
