//App.js

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './landingpage';
import Adminmain from './Admin/pages/main_admin';
import SignUpPage from './SignUp'; 
import SignInPage from './SignIn'; 
import RecipeSeekerSignUp from './RecipeSeeker/components/SignUp_RecepieSeeker';
import RecipeSeeker_InboxPage from './RecipeSeeker/components/Inbox';
import ConsultNutritionist from './RecipeSeeker/components/Refer_to_Nutritionist';
import DiscoverPage from './RecipeSeeker/components/Discover';
import SuccessComponent from './RecipeSeeker/components/SuccessComponent';
import CancelComponent from './RecipeSeeker/components/CancelComponent';
import Edit_profil_user from './RecipeSeeker/components/edit_profile';
import BlockReports from './Admin/pages/BlockReports';
import ChefSignUp from './Chef/pages/ChefSignUp';
import ChefMainPage from './Chef/pages/ChefMainPage';
import CreateRecipe from './Chef/pages/CreateRecipe';

import Delete from './Admin/pages/Delete';
import AllUsers from './Admin/pages/AllUsers';
import Blocked from './Admin/pages/Blocked';
import RegisterN from './Nutrionist/pages/Register-N';
import Main from './Nutrionist/pages/Main-N';
import Discover from './Nutrionist/pages/MakePlan';
import MealPlansPage from './Nutrionist/pages/ViewPlan';
import ChefBlockReports from './Admin/pages/BlockReports2';
import NutritionistBlockReports from './Admin/pages/BlockReports1';
import DisplayCollaboration from './Vendor/pages/Collaborations';
import DisplayCollaborationRequest from './Vendor/pages/CollaborationRequest';
import ChefDisplayFollowers from './Chef/pages/ChefFollowers';
import ChefProfile from './Chef/pages/ChefProfile';
import ChefUserInboxx from './Chef/pages/ChefUserInboxx';
import ChefVendorInboxx from './Chef/pages/ChefVendorInboxx';
import BlockReportsList from './Chef/pages/ChefVendorBlockReport';

import ChefProfile1 from './Nutrionist/pages/Edit-Profile';
import Chat from './Nutrionist/pages/Chat';

import VendorSignUp from './Vendor/pages/SignUp_vendor';
import VendorMainpage from './Vendor/pages/VendorMainpage';
import IngredientDetails from './Vendor/pages/ProductDetails';
import EditIngredient from './Vendor/pages/EditProductInformation';
import VendorProfile from './Vendor/pages/Profile';
import DisplayVendors from './Chef/pages/DisplayVendors';
import EditVendorProfile from './Vendor/pages/EditProfile';
import AddNewProduct from './Vendor/pages/AddNewProducts';
import Inbox from './Vendor/pages/chatwithchef';
import Edit1 from './Admin/pages/Edit-P';
import AcceptCert from './Admin/pages/AcceptCert';
import Followers from './Nutrionist/pages/Followers';

import ChefCollabs from './Chef/pages/ChefCollabRequests';
import ChefViewReviews from './Chef/pages/ChefReviews';
import MainBlock from './Admin/pages/MainBlock'
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
        <Route path="/recipe-seeker/UpdateProfile" element={<Edit_profil_user />} />
        <Route path="/recipe-seeker/Inbox" element={<RecipeSeeker_InboxPage />} />
        <Route path="/recipe-seeker/Consult_Nutritionist" element={<ConsultNutritionist />} />
        <Route path="/Pyement/Success" element={<SuccessComponent />} />
        <Route path="/Pyement/Failure" element={<CancelComponent />} />
        <Route path="/admin/blockreport" element={<BlockReports />} />
        <Route path="/admin/delete" element={<Delete />} />
        <Route path="/admin/registered-users" element={<AllUsers />} />
        <Route path="/admin/blocked-users" element={<Blocked />} />
        <Route path="/admin/edit-profile" element={<Edit1/>} />
        <Route path="/admin/check-c" element={<AcceptCert/>} />
        <Route path="/admin/chef-block" element={<ChefBlockReports/>} />
        <Route path="/admin/n-block" element={<NutritionistBlockReports/>} />



        <Route path="/signup/chef" element={<ChefSignUp/>}/>
        <Route path="/Chef/Mainpage" element={<ChefMainPage/>}/>
        <Route path="/Chef/CreateRecipe" element={<CreateRecipe/>} />
        <Route path="/Chef/AllVendors/:id" element={<DisplayVendors/>} />

       <Route path="/n/mainpage" element={<Main/>} /> 
        <Route path="/signup/nutritionist" element={<RegisterN />} />

        <Route path="/n/makeplan/:bmi/:userId" element={<Discover/>} />
        <Route path="/n/planmade/:nutritionistId" element={<MealPlansPage/>} />
        <Route path="/n-profile" element={<ChefProfile1/>} />

        <Route path="/Chef/myProfile" element={<ChefProfile/>} />
        <Route path="/Chef/usersInbox" element={<ChefUserInboxx/>} />
        <Route path="/Chef/vendorsInbox" element={<ChefVendorInboxx/>} />
        <Route path="/Chef/myFollowers" element={<ChefDisplayFollowers/>} />
        <Route path="/Chef/BlockReports" element={<BlockReportsList/>} />

        <Route path="/signup/vendor" element={<VendorSignUp/>}/>
        <Route path="/Vendor/Mainpage" element={<VendorMainpage />} />
        <Route path="/Vendor/Profile" element={<VendorProfile />} />
        <Route path="/Vendor/editProfile" element={<EditVendorProfile />} />
        <Route path="/vendor/Collaboration" element={<DisplayCollaboration/>} />
        <Route path="/vendor/CollaborationRequest" element={<DisplayCollaborationRequest/>} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/ingredients/editInfromation/:id" element={<EditIngredient/>} />
        <Route path="/ingredients/newProduct" element={<AddNewProduct/>} />
        <Route path="/vendor/inbox" element={<Inbox/>} />
    
        <Route path="/Chef/AllCollabs" element={<ChefCollabs/>} />
        <Route path="/Chef/AllReviews" element={<ChefViewReviews/>} />


        <Route path="/admin/MainBlock" element={<MainBlock/>} />

        <Route path="/nut/followers" element={<Followers/>} />
        <Route path="/n/chat" element={<Chat/>} />


      </Routes>
    </div>
  );
}

export default App;
