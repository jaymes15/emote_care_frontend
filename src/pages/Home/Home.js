import React, { useState, useEffect, useCallback } from 'react';
import getAccessToken from '../../utils/get_access_token';
import buildAPIUrl from '../../services/UrlBuilder';
import defaultProfilePicture from "../../assets/default_profile_picture.jpeg";
import "./Home.css";
import NavBar from '../../components/NavBar';

import { LoginRoute } from '../../constants';

function Home() {

    const [userToken, setUserToken] = useState(getAccessToken());
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [userDetails, setUserDetails] = useState({
        username: "",
        firstName: "",
        lastName: "",
        profilePicture: ""
    });
    const [allUserDetails, setallUserDetails] = useState([]);



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
                username: data.username,
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

    const fetchAllUsersHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(buildAPIUrl("v1/users/all/"), {
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
            setallUserDetails(data);

        } catch (error) {

            setError(error.message);
            setIsError(true);

        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUserDetailsHandler();
        fetchAllUsersHandler();

    }, [fetchUserDetailsHandler, fetchAllUsersHandler]);

    let content = <p></p>;

    if (allUserDetails.length > 0) {
        content = allUserDetails.map((user) => (


            <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3" key={user.id}>
                <a href="#">


                    <article className="overflow-hidden rounded-lg shadow-lg">


                        <img
                            alt="Placeholder"
                            className="users-pictures block h-auto w-full"
                            src={user.profile_picture ? user.profile_picture : defaultProfilePicture}
                             />




                        <footer className="flex items-center justify-between leading-none p-2 md:p-4">
                            <div className="flex items-center no-underline hover:underline text-black" >
                                <p className="ml-2 text-lg">
                                    {user.username}
                                </p>
                            </div>

                        </footer>

                    </article>
                </a>

            </div>


        ));
    }
    else {
        content = <p>Found no research communities.</p>;
    }

    return (
        <>
            {isLoading && <center><h3> Loading... </h3></center>}
            {isError && <center><h3> {error} </h3></center>}
            {!isLoading && !isError &&
               
                <>
                    <NavBar />



                    <div className="container my-12 mx-auto px-4 md:px-12">
                        <h3 className='welcome_text text-3xl'>
                        <img className="w-20 h-20 rounded-full" 
                            src={userDetails.profilePicture ? userDetails.profilePicture : defaultProfilePicture}
                             alt="Rounded avatar"/>
                             <br/>Welcome {userDetails.username}
                            
                        </h3>
                        <div className="flex flex-wrap -mx-1 lg:-mx-4">


                            {content}






                        </div>
                    </div>
                </>

            }
        </>
    );
}

export default Home;