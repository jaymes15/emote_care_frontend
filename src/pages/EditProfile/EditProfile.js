import React, { useState, useEffect, useCallback } from 'react';
import getAccessToken from '../../utils/get_access_token';
import { LoginRoute } from '../../constants';
import buildAPIUrl from '../../services/UrlBuilder';
import NavBar from '../../components/NavBar';


function EditProfile() {
    const [userToken, setUserToken] = useState(getAccessToken());
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [userDetails, setUserDetails] = useState({
        firstName: "",
        lastName: "",
        profilePicture: ""
    });

    
    const firstNameField = "firstName"
    const lastNameField = "lastName"
    const profilePictureField = "profilePicture"

    if (!userToken) {
        window.location.assign(LoginRoute);
    }

    const fetchUserDetailsHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(buildAPIUrl("v1/users/me/"), {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data);
            }
            setUserDetails({
                firstName: data.first_name,
                lastName: data.last_name,
                profilePicture: data.profile_picture
            });

            

        } catch (error) {

            setError(error.message);
            setIsError(true);

        }
        setIsLoading(false);
    }, []);

    const updateUserDetailsHandler = async (formData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(buildAPIUrl("v1/users/me/"), {
                method: "PATCH",
                headers: {
                    
                    'Authorization': `Bearer ${userToken}`
                },
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data);
            }
            setUserDetails({
                firstName: "",
                lastName: "",
                profilePicture: ""
            });
            window.location.assign("/");

        } catch (error) {

            setError(error.message);
            setIsError(true);

        }
        setIsLoading(false);
    }

    function onChangeHandler(event) {
        setUserDetails((prevState) => {
            return { ...prevState, [event.target.name]: event.target.value };
        });
    }

    function onChangeImageHandler(event) {
        setUserDetails((prevState) => {
            return { ...prevState, profilePicture: event.target.files[0] };
        });
    }

    async function submitHandler(event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append("first_name", userDetails.firstName);
        formData.append('last_name', userDetails.lastName);
       
        if (userDetails.profilePicture){
            formData.append('profile_picture', userDetails.profilePicture);
        }

        await updateUserDetailsHandler(formData)
        
    }


    useEffect(() => {
        fetchUserDetailsHandler();
    }, [fetchUserDetailsHandler]);

    return (
        <div className='login_background bg-orange-100'>
            <NavBar/>
            <center>
                <h3 className='header text-amber-500'>Edit Profile</h3>

                <form onSubmit={submitHandler} className="login_form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    {isError && <h3 className='editprofile-error-message'>{error}</h3>}
                    {isLoading && <h3>Loading...</h3>}

                  

                    <div>
                        <label htmlFor={firstNameField} className="block text-gray-700 text-sm font-bold mb-2">First Name</label>

                        <input
                            type='text'
                            id={firstNameField}
                            name={firstNameField}
                            value={userDetails.firstName}
                            onChange={onChangeHandler}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label htmlFor={lastNameField} className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>

                        <input
                            type='text'
                            id={lastNameField}
                            name={lastNameField}
                            value={userDetails.lastName}
                            onChange={onChangeHandler}
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <div>
                        <label htmlFor={profilePictureField} className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>

                        <input
                            className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="file"
                            id={profilePictureField}
                            name={profilePictureField}
                            onChange={onChangeImageHandler}
                        />

                    </div>

                    <button
                        className="editprofile-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit">
                        Edit Profile
                    </button>



                </form>


            </center>



        </div>
    );

}

export default EditProfile;