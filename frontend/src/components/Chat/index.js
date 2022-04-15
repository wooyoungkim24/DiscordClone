import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";

import { getServers, getTextChannels, setMessages , setInitialMessages} from "../../store/server";




function Chat({ socket, user, roomName, textId }) {

    const [text, setText] = useState("");
    const [textChannelId, setTextChannelId] = useState(textId)

    const updateText = (e) => {
        setText(e.target.value)
    }
    const dispatch = useDispatch();
    const messages = useSelector(state => {
        return state.myServers.messageHistory
    })

    const messageDispatch = (data) =>{
        let messageHistory = data.text
        console.log('what type is it', messageHistory)
        let username = data.username
        // console.log('how many times does this hit')

        dispatch(setMessages(messageHistory))
    }

    useEffect(() => {


        socket.on("message", messageDispatch);

        return () => socket.off("message", messageDispatch)
    }, [socket]);

    useEffect(() =>{
        dispatch(setInitialMessages(textId))
    }, [dispatch])

    const sendData = () => {
        if (text !== "") {
            //encrypt here
            const payload = {
                text,
                textId
            }
            socket.emit("chat", payload);
            setText("");
        }
    };

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom,
        [messages]);
    console.log("#######", roomName)
    return (
        <div className="text-channel-caontainer">
            <div className="text-channel-title">
                {roomName}
            </div>
            <div className="text-channel-content">
                {messages &&

                    <>
                        {messages.map((i) => {
                            if (i.username === user.username) {
                                return (
                                    <div className="message-mine">
                                        <img src={i.picture}></img>
                                        <p>{i.text}</p>
                                        <span>{i.username}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="message">
                                        <img src={i.picture}></img>
                                        <p>{i.text} </p>
                                        <span>{i.username}</span>
                                    </div>
                                );
                            }
                        })}
                    </>
                }


                <div ref={messagesEndRef} />
            </div>
            <div className="text-channel-input">
                <input
                    type="text"
                    placeholder="Message"
                    value={text}
                    onChange={updateText}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendData();
                        }
                    }}>

                </input>
                <button onClick={sendData}>Send</button>
            </div>

        </div>
    )
}


export default Chat
