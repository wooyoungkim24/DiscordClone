

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { setDMs, setInitialDMs, getDMs, getDMsTemp, getOtherPerson } from "../../store/session"
import moment from 'moment'
import "./index.css"


function DirectMessage({ user, socket }) {
    const history = useHistory();
    const { id } = useParams()
    const [otherPerson, setOtherPerson] = useState("")
    const userId = user.id
    const dispatch = useDispatch()
    const [text, setText] = useState("")

    const updateText = (e) => {
        setText(e.target.value)
    }

    // const dms = useSelector(state => {
    //     return state.session.myMessages
    // })

    const dmHistory = useSelector(state => {
        return state.session.mySingleDMs
    })

    useEffect(() => {
        const username = user.username
        const picture = user.profilePicture
        let intUser = parseInt(userId)
        let intId = parseInt(id)
        let roomNumber;
        if (intUser < intId) {
            roomNumber = `${intUser}_${intId}`
        } else {
            roomNumber = `${intId}_${intUser}`
        }

        socket.emit("joinRoom", { username, roomId: `dm${roomNumber}`, picture })
        const payload = {
            userId,
            id
        }
        dispatch(getOtherPerson(id))
            .then((data) => setOtherPerson(data))


        dispatch(getDMsTemp(user.id))
            .then((data) => {
                let dmIds = []

                data.forEach(x => {
                    dmIds.push(x.id)
                })
                // console.log("what have we got", dmIds, id)
                if (!dmIds.includes(parseInt(id))) {
                    history.push("/home")
                    return
                }
            })

        dispatch(setInitialDMs(payload))
    }, [id])



    const messageDispatch = (data) => {
        let messageHistory = data.text
        let sender = data.userId
        // future audio notif work around?
        console.log('differences', sender, user.id)
        if (parseInt(sender) !== parseInt(user.id)) {
            const audio = new Audio("https://citybrbphotos.s3.amazonaws.com/Discord_notification_-_sound_effect.mp3");
            audio.play();
        }

        dispatch(getDMs(user.id))
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

    // const messagesEndRef = useRef(null);

    // const scrollToBottom = () => {
    //     if (messageDispatch.current) {
    //         messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    //     }

    // };

    // useEffect(scrollToBottom,
    //     [dmHistory]);
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }


    function handleBrokenImg(el) {

        /*
        Perhaps show different broken image icons depending on various conditions
        Or add some style to it.. a border, background color, whatever..
      */
        el.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
    }

    useEffect(() => {
        scrollToBottom()
    }, [dmHistory]);
    return (
        <>
            {otherPerson &&

                <div className="direct-message-chat-container">

                    <div className="direct-message-title">
                        <i className="fas fa-at"></i>
                        {otherPerson.username}
                    </div>

                    <div className="direct-message-chat-box">
                        {dmHistory &&
                            <>

                                {dmHistory.map((i) => {
                                    // if (i.username === user.username) {
                                    return (
                                        <div className="message">
                                            <div className="message-left">
                                                <img onError={({ currentTarget }) => {
                                                    console.log("i am erroring", currentTarget)
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                }} src={i.picture} alt="profile picture"></img>
                                            </div>
                                            <div className="message-right">
                                                <div className="message-right-top">
                                                    {i.username}&nbsp;&nbsp;
                                                    {handleDate(i.date)}
                                                </div>
                                                <div className="message-right-bottom">
                                                    {i.text}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                    // } else {
                                    //     return (
                                    //         <div className="message">
                                    //             <img src={i.picture}></img>
                                    //             {handleDate(i.date)}
                                    //             {/* <div>
                                    //                 {moment(i.date).format("MMMM D YYYY")}
                                    //             </div> */}
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
                    <div className="direct-message-chat-input">
                        <input
                            type="text"
                            placeholder={`Message @${otherPerson.username}`}
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
            }

        </>

    )
}



export default DirectMessage
