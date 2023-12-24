//App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landingpage';
import Adminmain from './Admin/pages/main_admin';
import SignUpPage from './SignUp'; 
import SignInPage from './SignIn'; 
import RecipeSeekerSignUp from './RecipeSeeker/components/SignUp_RecepieSeeker';
import RecipeSeeker_InboxPage from './RecipeSeeker/components/Inbox';
import DiscoverPage from './RecipeSeeker/components/Discover';
import BlockReports from './Admin/pages/BlockReports';
import ChefSignUp from './Chef/pages/ChefSignUp';
import VendorSignUp from './Vendor/pages/SignUp_vendor';
import VendorMainpage from './Vendor/pages/VendorMainpage';
import ChefMainPage from './Chef/pages/ChefMainPage';
import IngredientDetails from './Vendor/pages/ProductDetails';
import EditIngredient from './Vendor/pages/EditProductInformation';
import VendorProfile from './Vendor/pages/Profile';
import CreateRecipe from './Chef/pages/CreateRecipe';
import DisplayVendors from './Chef/pages/DisplayVendors';
import EditVendorProfile from './Vendor/pages/EditProfile';
import AddNewProduct from './Vendor/pages/AddNewProducts';
import ChefDisplayFollowers from './Chef/pages/ChefFollowers';
import ChefProfile from './Chef/pages/ChefProfile';
import ChefUserInboxx from './Chef/pages/ChefUserInboxx';
import ChefVendorInboxx from './Chef/pages/ChefVendorInboxx';

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
        <Route path="/recipe-seeker/Inbox" element={<RecipeSeeker_InboxPage />} />
        <Route path="/admin/blockreport" element={<BlockReports />} />
        <Route path="/signup/chef" element={<ChefSignUp/>}/>
        <Route path="/signup/vendor" element={<VendorSignUp/>}/>
        <Route path="/Vendor/Mainpage" element={<VendorMainpage />} />
        <Route path="/Vendor/Profile" element={<VendorProfile />} />
        <Route path="/Vendor/editProfile" element={<EditVendorProfile />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/ingredients/editInfromation/:id" element={<EditIngredient/>} />
        <Route path="/ingredients/newProduct" element={<AddNewProduct/>} />
        <Route path="/Chef/Mainpage" element={<ChefMainPage/>}/>
        <Route path="/Chef/CreateRecipe" element={<CreateRecipe/>} />
        <Route path="/Chef/AllVendors" element={<DisplayVendors/>} />
        <Route path="/Chef/myFollowers" element={<ChefDisplayFollowers/>} />
        <Route path="/Chef/myProfile" element={<ChefProfile/>} />
        <Route path="/Chef/usersInbox" element={<ChefUserInboxx/>} />
        <Route path="/Chef/vendorsInbox" element={<ChefVendorInboxx/>} />

      </Routes>
    </div>
  );
}

export default App;
