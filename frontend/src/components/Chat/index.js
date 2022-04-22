import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import moment from 'moment'
import { getServers, getTextChannels, setMessages, setInitialMessages } from "../../store/server";
import "./index.css"


function Chat({ socket, user, roomName, textId }) {

    const [text, setText] = useState("");
    // const [textChannelId, setTextChannelId] = useState(textId)

    const updateText = (e) => {
        setText(e.target.value)
    }
    const dispatch = useDispatch();
    const messages = useSelector(state => {
        return state.myServers.messageHistory
    })

    const messageDispatch = (data) => {

        if (textId === data.text.id) {
            let messageHistory = data.text.messageHistory


            // console.log('how many times does this hit')

            dispatch(setMessages(messageHistory))
        }

    }

    useEffect(() => {


        socket.on("message", messageDispatch);

        // socket.on("send", (data)=> console.log('is you coming here',data))

        return () => socket.off("message", messageDispatch)
    }, [socket]);

    useEffect(() => {
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
    const handleDate = (date) => {
        let now = new Date();
        let messageDate = new Date(date)
        let diff = now - messageDate
        if ((diff / 100 / 60 / 60) >= 24) {
            return (
                <div className="more-than-24">
                    {moment(messageDate).format("MMMM D YYYY")}
                </div>
            )
        } else {
            return (
                <div className="less-than-24">
                    {moment(messageDate).format('h:mm a')}
                </div>
            )
        }
    }


    useEffect(scrollToBottom,
        [messages]);
    // console.log("#######", roomName)
    return (
        <div className="text-channel-container">
            <div className="text-channel-title">
                <i className="fas fa-hashtag"></i>
                {roomName}
            </div>
            <div className="text-channel-content">
                {messages &&

                    <>
                        {messages.map((i) => {
                            // if (i.username === user.username) {
                            return (
                                <div className="text">
                                    <div className="text-left">
                                        <img onError={({ currentTarget }) => {
                                            console.log("i am erroring", currentTarget)
                                            currentTarget.onerror = null;
                                            currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                        }} src={i.picture} alt="profile picture"></img>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-right-top">
                                            {i.username}&nbsp;&nbsp;
                                            {handleDate(i.date)}
                                        </div>
                                        <div className="text-right-bottom">
                                            {i.text}
                                        </div>

                                    </div>
                                </div>

                            );
                            // } else {
                            //     return (
                            //         <div className="message">
                            //             <img src={i.picture}></img>
                            //             <div>
                            //                 {moment(i.date).format("MMMM D YYYY")}
                            //             </div>
                            //             <p>{i.text} </p>
                            //             <span>{i.username}</span>
                            //         </div>
                            //     );
                            // }
                        })}
                        <div ref={messagesEndRef} />
                    </>
                }



            </div>
            <div className="text-channel-input">
                <input
                    type="text"
                    placeholder={`Message #${roomName}`}
                    value={text}
                    onChange={updateText}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            sendData();
                        }
                    }}>

                </input>
                {/* <button onClick={sendData}>Send</button> */}
            </div>

        </div>
    )
}


export default Chat
