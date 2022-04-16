

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { setDMs, setInitialDMs } from "../../store/session"
import moment from 'moment'



function DirectMessage({ user, socket }) {
    const { id } = useParams()
    const userId = user.id
    const dispatch = useDispatch()
    const [text, setText] = useState("")

    const updateText = (e) => {
        setText(e.target.value)
    }

    const dmHistory = useSelector(state => {
        return state.session.mySingleDMs
    })

    useEffect(() => {
        const username = user.username
        const picture = user.profilePicture
        let intUser = parseInt(userId)
        let intId = parseInt(id)
        let roomNumber;
        if(intUser < intId){
            roomNumber = `${intUser}_${intId}`
        }else{
            roomNumber = `${intId}_${intUser}`
        }
        socket.emit("joinRoom", { username, roomId: `dm${roomNumber}`, picture })
        const payload = {
            userId,
            id
        }
        dispatch(setInitialDMs(payload))
    }, [id])



    const messageDispatch = (data) => {
        let messageHistory = data.text

        dispatch(setDMs(messageHistory))
    }

    useEffect(() => {


        socket.on("DMmessage", messageDispatch);

        return () => socket.off("DMmessage", messageDispatch)
    }, [socket]);


    const sendData = () => {
        if (text !== "") {
            //encrypt here
            const payload = {
                text,
                userId,
                otherId: id
            }

            socket.emit("dm", payload);
            setText("");
        }
    };
    return (
        <div className="direct-message-chat-container">
            <div className="direct-message-title">
                {id}
            </div>
            <div className="direct-message-chat-box">
                {dmHistory &&

                    <>
                        {dmHistory.map((i) => {
                            if (i.username === user.username) {
                                return (
                                    <div className="message-mine">
                                        <img src={i.picture}></img>
                                        <div>
                                            {moment(i.date).format("MMMM D YYYY")}
                                        </div>
                                        <p>{i.text}</p>
                                        <span>{i.username}</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="message">
                                        <img src={i.picture}></img>
                                        <div>
                                            {moment(i.date).format("MMMM D YYYY")}
                                        </div>
                                        <p>{i.text} </p>
                                        <span>{i.username}</span>
                                    </div>
                                );
                            }
                        })}
                    </>
                }
            </div>
            <div className="direct-message-chat-input">
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



export default DirectMessage
