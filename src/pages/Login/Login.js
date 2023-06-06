import React, { useState } from 'react';
import { Link } from "react-router-dom";
import buildAPIUrl from "../../services/UrlBuilder";
import setTokensToLocalStorage from "../../utils/set_tokens";
import { signUpRoute } from '../../constants';
import './Login.css';

function Login() {
    const [userDetails, setUserDetails] = useState({
        username: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const usernameField = "username"
    const passwordField = "password"

    function onChangeHandler(event) {
        setUserDetails((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    function validateField() {
        setError("")
        if (userDetails.username === "" ||
            userDetails.password === "") {
            throw new Error("All Fields Are Required");
        }

    }

    async function getUserAccessAndRefreshToken() {
        setIsLoading(true);
        const response = await fetch(buildAPIUrl("v1/users/token/"), {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userDetails.username,
                password: userDetails.password
            })
        });
        let res = await response.json()
        if (!response.ok) {
            let error = res;
          

            if (error.username) {
                throw new Error(error.username);
            } else if (error.password) {
                throw new Error(error.password);
            } else {
                throw new Error(error.detail);
            }

        }
        else {
            setUserDetails({
                username: "",
                password: ""
            });
            setTokensToLocalStorage(res.access, res.refresh);
            setIsLoading(false);
            
            window.location.assign('/');
        }
       
    }

    async function submitHandler(event) {
        try {
            event.preventDefault();
            validateField();
            await getUserAccessAndRefreshToken();

        } catch (error) {
            setIsError(true);
            setIsLoading(false);
            setError(error.message);

        }
    }

    return (
        <div className='login_background bg-orange-100'>
            <center>
                <h3 className='header text-amber-500'>Login To Chat App</h3>

                <form onSubmit={submitHandler} className="login_form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {isError && <h3 className='signup-error-message'>{error}</h3>}

                    <div>
                        <label htmlFor={usernameField} className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        
                        <input
                            type='text'
                            id={usernameField}
                            name={usernameField}
                            value={userDetails.username}
                            onChange={onChangeHandler}
                            required
                            disabled={isLoading? "disabled": ""}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor={passwordField} className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        
                        <input
                            type='password'
                            id={passwordField}
                            name={passwordField}
                            value={userDetails.password}
                            onChange={onChangeHandler}
                            required
                            disabled={isLoading? "disabled": ""}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    
                    {!isLoading &&<button 
                    className="login-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit">
                        Login
                    </button>}
                    {isLoading && <button 
                    className="login-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit" disabled={isLoading? "disabled": ""}>
                        Sending...
                    </button>}
                    <br/>
                    <Link 
                    className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                    to={signUpRoute}>
                        Sign Up 
                    </Link>

                    

                </form>
                
               
            </center>



        </div>
    );

}

export default Login;