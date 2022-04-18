
import React, { useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { getPendingServers } from "../../store/server";
import {removeFriend,getInitialPendingSentFriends,rejectFriend, getMyFriends, getPendingFriends, acceptFriend, getNotFriends, sendAddFriend } from "../../store/session";



function FriendsList({ user, friends, socket }) {

    const [showAll, setShowAll] = useState(true)
    const [showOnline, setShowOnline] = useState(false)
    const [showPending, setShowPending] = useState(false)
    const [showAddFriend, setShowAddFriend] = useState(false)

    const pendingFriends = useSelector(state => {
        return state.session.pendingFriends
    })

    const notFriends = useSelector(state => {
        return state.session.notFriends
    })

    const pendingSentFriends = useSelector(state => {
        return state.session.pendingSentFriends
    })

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

    const reloadFriends = (data) => {
        let userId = data.userId
        if (userId !== user.id) {
            // console.log('are you even running #####')
            dispatch(getMyFriends(user.id))
        }

    }

    useEffect(() => {
        dispatch(getPendingFriends(user.id))
        dispatch(getNotFriends(user.id))

        dispatch(getInitialPendingSentFriends(user.id))
    }, [dispatch])


    useEffect(() => {
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
        setShowAddFriend(false)
    }
    const handleOnline = () => {
        setShowOnline(true)
        setShowAll(false)
        setShowPending(false)
        setShowAddFriend(false)
    }
    const handlePending = () => {
        setShowOnline(false)
        setShowAll(false)
        setShowPending(true)
        setShowAddFriend(false)
    }

    const handleAddFriend = () => {
        setShowOnline(false)
        setShowAll(false)
        setShowPending(false)
        setShowAddFriend(true)
    }

    const handleFriendAccept = (id) => {
        const payload = {
            id,
            userId: user.id
        }
        dispatch(acceptFriend(payload))
        dispatch(getMyFriends(user.id))
        socket.emit("addedFriend", {userId:user.id, notify:id})
    }


    const handleAddFriendSubmit = (friend) => {
        const payload = {
            friend1: user.id,
            friend2: friend.id
        }
        dispatch(sendAddFriend(payload))

    }

    const handleRemoveFriend = (id) =>{
        const payload = {
            friend1:user.id,
            friend2:id
        }
        dispatch(removeFriend(payload))
        dispatch(getMyFriends(user.id))
    }

    const handleFriendReject = (id) => {
        const payload = {
            id,
            userId: user.id
        }
        dispatch(rejectFriend(payload))
        dispatch(getMyFriends(user.id))
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
                    <button onClick={handleAddFriend}>
                        Add Friend
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
                                    <button onClick={() => handleRemoveFriend(ele.id)}>
                                        Remove Friend
                                    </button>
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
                {showPending &&

                    <div className="pending-friends">
                        {pendingFriends.map(ele => {
                            return (
                                <div className="pending-friends-individual">
                                    {/* <img src={ele.added.profilePicture}></img> */}
                                    <div className="pending-friend-text">
                                        {ele.added.username} wants to be friends
                                    </div>
                                    <div className="pending-friend-buttons">
                                        <button type="button" onClick={() => handleFriendAccept(ele.id)} >
                                            Accept
                                        </button>
                                        <button type="button" onClick={() => handleFriendReject(ele.id)} >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                }
                {showAddFriend &&
                    <div className="add-friends-container">
                        {notFriends.map(ele => {
                            let pending = false
                            let pendingSent = [];
                            pendingSentFriends.forEach(ele =>{
                                pendingSent.push(ele.friend2)
                            })
                            if(pendingSent.includes(parseInt(ele.id))){
                                pending = true
                            }

                            return (
                                <div className="other-users-div">
                                    <img src={ele.profilePicture}></img>
                                    <div className="other-users-name">
                                        {ele.username}
                                    </div>
                                    {!pending &&
                                        <button type="button" onClick={() => handleAddFriendSubmit(ele)}>
                                            Add User
                                        </button>
                                    }
                                    {pending &&
                                        <button type="button" disabled>
                                            Pending
                                        </button>
                                    }

                                </div>
                            )
                        })}
                    </div>
                }

            </div>
        </div>
    )
}


export default FriendsList
