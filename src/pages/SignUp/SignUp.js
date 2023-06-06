import React, { useState } from 'react';
import buildAPIUrl from "../../services/UrlBuilder";
import setTokensToLocalStorage from "../../utils/set_tokens";
import { Link } from "react-router-dom";
import { LoginRoute } from '../../constants';
import './SignUp.css';

function SignUp() {
    const [userDetails, setUserDetails] = useState({
        username: "",
        confirmPassword: "",
        password: ""
    });
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const usernameField = "username"
    const passwordField = "password"
    const confirmPasswordField = "confirmPassword"

    function onChangeHandler(event) {
        setUserDetails((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    function validateField() {
        setError("")
        if (userDetails.username === "" ||
            userDetails.confirmPassword === "" ||
            userDetails.password === "") {
            throw new Error("All Fields Are Required");
        }

        if (userDetails.password !== userDetails.confirmPassword) {
            throw new Error("Password And Confirm Password Field Do Not Match");

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
                password: userDetails.confirmPassword
            })
        });

        let res = await response.json()
        if (!response.ok) {
            let error = res;

            if (error.username) {
                throw new Error(error.username);
            } else if (error.password) {
                throw new Error(error.password);
            } else if(error.non_field_errors){
                throw new Error(error.non_field_errors[0]);
            }else {
                throw new Error(error);
            }

        }
        else {
            setUserDetails({
                username: "",
                confirmPassword: "",
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
            setIsLoading(true);

            const response = await fetch(buildAPIUrl("v1/users/"), {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: userDetails.username,
                    password: userDetails.confirmPassword
                })
            });

            if (!response.ok) {
                let error = await response.json()

                if (error.username) {
                    throw new Error(error.username);
                } else if (error.password) {
                    throw new Error(error.password);
                } else if(error.non_field_errors){
                    throw new Error(error.non_field_errors[0]);
                }else {
                    throw new Error(error);
                }

            }
            else {
                await getUserAccessAndRefreshToken();
            }


        } catch (error) {
            setIsError(true);
            setIsLoading(false);
            setError(error.message);

        }
    }

    return (
        <div className='signup_background bg-orange-100'>
            <center>
                <h3 className='header text-amber-500'>Sign Up To Chat App</h3>

                <form onSubmit={submitHandler} className="signup_form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {isError && <h3 className='signup-error-message'>{error}</h3>}

                    <div className='mb-4'>
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
                    
                    <div className='mb-4'>
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
                    
                    <div className='mb-4'>
                        <label htmlFor={confirmPasswordField} className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        
                        <input
                            type='password'
                            id={confirmPasswordField}
                            name={confirmPasswordField}
                            value={userDetails.confirmPassword}
                            onChange={onChangeHandler}
                            required
                            disabled={isLoading? "disabled": ""}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <br />
                    <button 
                    className="signup-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                    type="submit"
                    >
                            Sign Up
                    </button>
                    <br/>
                    {!isLoading && <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" to={LoginRoute}>
                        Login
                    </Link>}
                    {isLoading && <h3>Sending...</h3>}
                </form>

                <br /><br />
                
                

            </center>

          

        </div>
    );

}

export default SignUp;