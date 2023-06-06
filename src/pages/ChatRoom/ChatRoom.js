import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import getAccessToken from "../../utils/get_access_token";
import { LoginRoute } from "../../constants";

import NavBar from "../../components/NavBar";
import "./Chat.css";
import defaultProfilePicture from "../../assets/default_profile_picture.jpeg";
import { webSocketUrl, baseUrl} from "../../services/Url";
import buildAPIUrl from "../../services/UrlBuilder";

function ChatRoom() {
    let param = useParams();
    const [userToken, setUserToken] = useState(getAccessToken());
    const [socketMessage, setsocketMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState("");
    const [otherUserDp, setotherUserDp] = useState("");
    const [sendMyMessage, setSendMyMessage] = useState("");

    var websocket = new WebSocket(
        `${webSocketUrl()}/ws/chat/${param.otherUsername}/?token=${userToken}`
    );
    var listOfMessages = []



    if (!userToken) {
        window.location.assign(LoginRoute);
    }

    const fetchMessagesHandler = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(buildAPIUrl(`v1/chats/?other_username=${param.otherUsername}`), {
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


            let obj = data.find(otherUser => otherUser.sender.username === param.otherUsername);
            
            if (obj && obj.sender.profile_picture && obj.sender.profile_picture.includes("https:")) {
                setotherUserDp(obj.sender.profile_picture);
            }
            else if (obj && obj.sender.profile_picture) {
                let url = baseUrl()
                setotherUserDp(`http://${url}${obj.sender.profile_picture}`)
            }


            // data.reverse()


            listOfMessages.push(data);
            setAllMessages(data);


        } catch (error) {

            setError(error.message);
            setIsError(true);

        }
        setIsLoading(false);

    }, [])

    const webSocketHandler = useCallback(() => {

        websocket.onopen = () => {
            console.log('connected');
           
        }

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            listOfMessages[0].push({
                sender: {
                    username: data.username
                },
                text: data.text
            });
            setLastMessage(data);
            updateUI()

        }


        websocket.onerror = (event) => {
            console.log("Something went wrong");
            console.log(event)
            setsocketMessage(`${event}`)
            
        }

        return () => {
            websocket.close()
        }
    }, []);

    useEffect(() => {
        fetchMessagesHandler();
        webSocketHandler();
        return () => { }

    }, []);

    let content = <p></p>;


    const updateUI = () => {

        setAllMessages(listOfMessages[0]);
        setContent()
    }
    const setContent = () => {

        if (allMessages.length > 0) {
            content = allMessages.map((messages) => (



                <>

                    {messages.is_bot !== true && messages.sender.username === param.otherUsername && <div className="chat-message">

                        <div className="user-message" style={{ width: "30px" }}>
                            {messages.text}
                        </div>
                    </div>}

                    {messages.is_bot !== true && messages.sender.username !== param.otherUsername && <div className="chat-message">

                        <div className="bot-message">
                            {messages.text}
                        </div>
                    </div>}

                    {messages.is_bot === true && <div className="chat-message">

                        <div className="bot-message" style={{ backgroundColor: "yellow", marginRight: "10%" }}>
                            {messages.text}
                        </div>
                    </div>}
                </>


            ));
        }
        else {
            content = <p>Found no Messages.</p>;
        }

    }

    function sendMessageHandler(event) {
        event.preventDefault();

        websocket.send(sendMyMessage);

        setSendMyMessage("");

    }

    function onChangeHandler(event) {
        setSendMyMessage(event.target.value)
    }






    setContent();


    return (
        <>
            <NavBar />
            <div className="chat_bar flex">
                <img className="flex-none w-20 h-20 rounded-full"
                    src={otherUserDp ? otherUserDp : defaultProfilePicture}
                    alt="Rounded avatar" />

                <h3 className='otherUsername flex-1 w-64 text-2xl'>
                    {param.otherUsername}
                </h3>

            </div>

            <div className="chat-container" >

                {content}





                <form onSubmit={sendMessageHandler} className="chat-textfield ">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder="Type your message"
                        onChange={onChangeHandler}
                        value={sendMyMessage}

                        required />
                    <button className="chat-send-button">Send</button>

                </form>



            </div>



        </>
    );

}

export default ChatRoom;