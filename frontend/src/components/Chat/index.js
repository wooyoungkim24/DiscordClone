import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";

import { getServers, getTextChannels, setMessages } from "../../store/server";




function Chat({ socket, user, roomName, textId }) {

    const [text, setText] = useState("");
    const [textChannelId, setTextChannelId] = useState(textId)

    const updateText = (e) => {
        setText(e.target.value)
    }
    const dispatch = useDispatch();
    const messages = useSelector(state => {
        return state.myServers.messageHistories
    })

    const messageDispatch = (data) =>{
        let messageHistory = data.text

        let username = data.username
        console.log('how many times does this hit')
        const payload = {
            messageHistory,
            textId: textId,
            username
        }
        dispatch(setMessages(payload))
    }

    useEffect(() => {

        socket.on("message", messageDispatch);

        return () => socket.off("message", messageDispatch)
    }, [socket]);

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
    console.log("where is it", messages[parseInt(textId)])
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
                {messages[parseInt(textId)] &&

                    <>
                        {messages[parseInt(textId)].map((i) => {
                            if (i.username === user.username) {
                                return (
                                    <div className="message-mine">
                                        <p>{i.message}</p>
                                        <span>{i.username}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="message">
                                        <p>{i.message} </p>
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
