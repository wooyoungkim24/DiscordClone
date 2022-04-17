
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import {getMyFriends} from "../../store/session";



function FriendsList({ user,friends, socket }) {

    const [showAll, setShowAll] = useState(true)
    const [showOnline, setShowOnline] = useState(false)
    const [showPending, setShowPending] = useState(false)

    const dispatch = useDispatch();
    const onlineDot = (ele) => {
        if (ele.online) {
            return (
                <div className="online-dot">
                    <i class="fas fa-circle"></i>
                </div>
            )
        } else {
            return (
                <div className="offline-dot">
                    <i class="fas fa-circle"></i>
                </div>
            )
        }
    }

    const online = (ele) => {
        if (ele.online) {
            return (
                <div className="online-status">
                    Online
                </div>
            )
        } else {
            return (
                <div className="offline-status">
                    Offline
                </div>
            )
        }
    }

    const reloadFriends = (data) =>{
        let userId = data.userId
        if(userId !== user.id){
            console.log('are you even running #####')
            dispatch(getMyFriends(user.id))
        }

    }


    useEffect(() =>{
        socket.on("loggedOn", reloadFriends)
        socket.on("loggedOff", reloadFriends)

        return () => {
            socket.off("loggedOn", reloadFriends)
            socket.off("loggedOff", reloadFriends)
        }
    }, [socket])

    const handleAll = () => {
        setShowOnline(false)
        setShowAll(true)
        setShowPending(false)
    }
    const handleOnline = () => {
        setShowOnline(true)
        setShowAll(false)
        setShowPending(false)
    }
    const handlePending = () => {
        setShowOnline(false)
        setShowAll(false)
        setShowPending(true)
    }

    return (
        <div className="friends-list-container">

            <div className="friends-list-type">
                <div className="friends-list-buttons">
                    <button onClick={handleAll}>
                        All
                    </button>
                    <button onClick={handleOnline}>
                        Online
                    </button>
                    <button onClick={handlePending}>
                        Pending
                    </button>
                </div>
                {showAll &&
                    <div className="all-friends">
                        {friends.map(ele => {
                            return (
                                <div className="friends-list-individual">
                                    <div className="friend-list-image-container">
                                        <img src={ele.profilePicture}></img>
                                        {onlineDot(ele)}
                                    </div>

                                    <div className="friends-list-name">
                                        {ele.username}
                                        <div className="friends-list-online-status">
                                            {online(ele)}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
                {showOnline &&
                    <div className="online-friends">
                        {friends.map(ele => {
                            if (ele.online) {
                                return (
                                    <div className="friends-list-individual">
                                        <div className="friend-list-image-container">
                                            <img src={ele.profilePicture}></img>
                                            {onlineDot(ele)}
                                        </div>

                                        <div className="friends-list-name">
                                            {ele.username}
                                            <div className="friends-list-online-status">
                                                {online(ele)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        })}
                    </div>
                }

                <div className="pending-friends">

                </div>
            </div>
        </div>
    )
}


export default FriendsList
