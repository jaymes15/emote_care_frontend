import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import getAccessToken from "../../utils/get_access_token";
import { LoginRoute } from "../../constants";
import buildAPIUrl from "../../services/UrlBuilder";
import NavBar from "../../components/NavBar";
import "./Chat.css";
import defaultProfilePicture from "../../assets/default_profile_picture.jpeg";

function ChatRoom() {
    let param = useParams();
    const [userToken, setUserToken] = useState(getAccessToken());
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState("");
    const [allMessages, setAllMessages] = useState([]);
    const [lastMessage, setLastMessage] = useState("");
    const [otherUserDp, setotherUserDp] = useState("");
    const [sendMyMessage, setSendMyMessage] = useState("");

    var websocket = websocket = new WebSocket(
        `ws://0.0.0.0:8000/ws/chat/${param.otherUsername}/?token=${userToken}`
    );
    var a = []



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


            // let obj = data.find(otherUser => otherUser.sender.username === param.otherUsername);

            // setotherUserDp(`http://localhost:8000${obj.sender.profile_picture}`)
            a.push(data);
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
            console.log("MMM")
            console.log(a)
            console.log(data)
            // setAllMessages({data});
            a[0].push({
                sender: {
                    username: data.username
                },
                text: data.text
            });
            setLastMessage(data);
            c()
              
        }
        

        websocket.onerror = (event) => {
            console.log("Something went wrong");
            console.log(event)
        }

        return () => {
            websocket.close()
        }
    }, []);

    useEffect(() => {
        fetchMessagesHandler();
        webSocketHandler();
        return () => {} 

    }, []);

    let content = <p></p>;


    const c = () => {
        console.log(a[0])
        setAllMessages(a[0]);
        setContent()
    }
    const setContent = () => {
   
        if (allMessages.length > 0) {
            content = allMessages.map((messages) => (
                


                <>
                    {console.log("AAA")}
                    {console.log(messages.is_bot)}
                    {messages.is_bot !== true && messages.sender.username === param.otherUsername && <div className="chat-message">

                        <div className="user-message" style={{width: "30px"}}>
                            {messages.text}
                        </div>
                    </div>}

                    {messages.is_bot !== true && messages.sender.username !== param.otherUsername && <div className="chat-message">

                        <div className="bot-message">
                            {messages.text}
                        </div>
                    </div>}
                    
                    {messages.is_bot === true && <div className="chat-message">

                        <div className="bot-message" style={{backgroundColor: "yellow", marginRight: "10%"}}>
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
                        <button class="chat-send-button">Send</button>

                    </form>



                </div>



        </>
    );

}

export default ChatRoom;