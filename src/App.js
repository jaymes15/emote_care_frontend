import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home/Home";
import Protected from './components/Protected';
import getAccessToken from "./utils/get_access_token";
import Login from './pages/Login/Login';
import { signUpRoute, LoginRoute } from './constants';

function App() {
  const [userToken, setUserToken] = useState(getAccessToken());

  return (


    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Protected isSignedIn={userToken ? true : false}>
              <Home />
            </Protected>
          }
        />


        <Route exact={true} path={signUpRoute} element={<SignUp />} />
        <Route exact={true} path={LoginRoute} element={<Login />}>

        </Route>
      </Routes>
    </BrowserRouter>



  );
}


export default App;
