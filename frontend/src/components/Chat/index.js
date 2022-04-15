import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";

import { getServers, getTextChannels } from "../../store/server";




function Chat({ socket, user, roomName, setMessages, messages }) {


    const [text, setText] = useState("");


    const updateText = (e) => {
        setText(e.target.value)
    }
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on("message", (data) => {
            let temp = messages;
            temp.push({
                userId: data.userId,
                username: data.username,
                text: data.text,
            });
            setMessages([...temp]);
        });
    }, [socket]);

    const sendData = () => {
        if (text !== "") {
            //encrypt here

            socket.emit("chat", text);
            setText("");
        }
    };
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    console.log("#######", roomName)
    return (
        <div className="text-channel-caontainer">
            <div className="text-channel-title">
                {roomName}
            </div>
            <div className="text-channel-content">
                {messages.map((i) => {
                    if (i.username === user.username) {
                        return (
                            <div className="message-mine">
                                <p>{i.text}</p>
                                <span>{i.username}</span>
                            </div>
                        );
                    } else {
                        return (
                            <div className="message">
                                <p>{i.text} </p>
                                <span>{i.username}</span>
                            </div>
                        );
                    }
                })}
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
