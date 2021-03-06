
import React, { useState, useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import { getPendingServers } from "../../store/server";
import { removeFriend, getInitialPendingSentFriends, rejectFriend, getMyFriends, getPendingFriends, acceptFriend, getNotFriends, sendAddFriend } from "../../store/session";
import "./index.css"


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
                <div className="online-dot-friend">
                    <i className="fas fa-circle"></i>
                </div>
            )
        } else {
            return (
                <div className="offline-dot-friend">
                    <i className="fas fa-circle"></i>
                </div>
            )
        }
    }

    const online = (ele) => {
        if (ele.online) {
            return (
                <div className="online-status-friend">
                    Online
                </div>
            )
        } else {
            return (
                <div className="offline-status-friend">
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

    const handleAll = (e) => {
        // console.log('waht is target', e.target)
        setShowOnline(false)
        setShowAll(true)
        setShowPending(false)
        setShowAddFriend(false)
        document.querySelectorAll(".friends-button").forEach(ele => {
            ele.classList.remove("select")
        })
        e.target.classList.add("select")

    }
    const handleOnline = (e) => {
        setShowOnline(true)
        setShowAll(false)
        setShowPending(false)
        setShowAddFriend(false)
        document.querySelectorAll(".friends-button").forEach(ele => {
            ele.classList.remove("select")
        })
        e.target.classList.add("select")

    }
    const handlePending = (e) => {
        setShowOnline(false)
        setShowAll(false)
        setShowPending(true)
        setShowAddFriend(false)
        document.querySelectorAll(".friends-button").forEach(ele => {
            ele.classList.remove("select")
        })
        e.target.classList.add("select")

    }

    const handleAddFriend = (e) => {
        setShowOnline(false)
        setShowAll(false)
        setShowPending(false)
        setShowAddFriend(true)
        document.querySelectorAll(".friends-button").forEach(ele => {
            ele.classList.remove("select")
        })
        e.target.classList.add("select")

    }

    const handleFriendAccept = (id) => {
        const payload = {
            id,
            userId: user.id
        }
        dispatch(acceptFriend(payload))
        dispatch(getMyFriends(user.id))
        socket.emit("addedFriend", { userId: user.id, notify: id })
    }


    const handleAddFriendSubmit = (friend) => {
        const payload = {
            friend1: user.id,
            friend2: friend.id
        }
        dispatch(sendAddFriend(payload))

    }

    const handleRemoveFriend = (id) => {
        const payload = {
            friend1: user.id,
            friend2: id
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
    function handleBrokenImg(el) {

        /*
        Perhaps show different broken image icons depending on various conditions
        Or add some style to it.. a border, background color, whatever..
      */
        el.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
    }

    return (
        <div className="friends-list-container">

            <div className="friends-list-buttons">
                <div className="friends-list-buttons-title">
                    <i className="fas fa-user"></i> &nbsp;
                    Friends
                </div>
                <button className='all friends-button select' onClick={handleAll}>
                    All
                </button>
                <button className='online friends-button' onClick={handleOnline}>
                    Online
                </button>
                <button className='pending friends-button' onClick={handlePending}>
                    Pending
                </button>
                <button className='add-friends-button' onClick={handleAddFriend}>
                    Add Friend
                </button>
            </div>

            {showAll &&
                <div className="all-friends">
                    All
                    {friends.length
                        ? <>
                            {friends.map((ele,i) => {
                                return (
                                    <div key = {i} className="friends-list-individual">
                                        <div className="friends-list-individual-left">
                                            <div className="friend-list-image-container">
                                                <img onError={({ currentTarget }) => {
                                                    // console.log("i am erroring", currentTarget)
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                }} src={ele.profilePicture} alt="profile picture"></img>
                                                {onlineDot(ele)}
                                            </div>

                                            <div className="friends-list-name">
                                                {ele.username}
                                                <div className="friends-list-online-status">
                                                    {online(ele)}
                                                </div>
                                            </div>
                                        </div>

                                        <button className='remove-friend' onClick={() => handleRemoveFriend(ele.id)}>
                                            Remove Friend
                                        </button>
                                    </div>
                                )
                            })}
                        </>
                        : <div className="no-friends">
                            No Friends Yet
                        </div>

                    }

                </div>
            }
            {showOnline &&
                <div className="online-friends">
                    Online
                    {friends.map((ele,i) => {
                        if (ele.online) {
                            return (
                                <div key = {i} className="friends-list-individual">
                                    <div className="friends-list-individual-left">
                                        <div className="friend-list-image-container">
                                            <img onError={({ currentTarget }) => {
                                                // console.log("i am erroring", currentTarget)
                                                currentTarget.onerror = null;
                                                currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                            }} src={ele.profilePicture} alt="profile picture"></img>
                                            {onlineDot(ele)}
                                        </div>

                                        <div className="friends-list-name">
                                            {ele.username}
                                            <div className="friends-list-online-status">
                                                {online(ele)}
                                            </div>
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
                    These people want to be your friend!
                    {pendingFriends.map((ele,i) => {
                        return (
                            <div key = {i} className="pending-friends-individual">
                                <div className="pending-friends-left">
                                    <img onError={({ currentTarget }) => {
                                        // console.log("i am erroring", currentTarget)
                                        currentTarget.onerror = null;
                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                    }} src={ele.added.profilePicture} alt="profile picture"></img>

                                    <div className="pending-friend-text">
                                        {ele.added.username} wants to be friends
                                    </div>
                                </div>

                                <div className="pending-friend-buttons">
                                    <button type="button" className='accept-friend-button' onClick={() => handleFriendAccept(ele.id)} >
                                        Accept
                                    </button>
                                    <button type="button" className='reject-friend-button' onClick={() => handleFriendReject(ele.id)} >
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
                    {notFriends.map((ele,i) => {
                        let pending = false
                        let pendingSent = [];
                        pendingSentFriends.forEach(ele => {
                            pendingSent.push(ele.friend2)
                        })
                        if (pendingSent.includes(parseInt(ele.id))) {
                            pending = true
                        }

                        return (
                            <div key = {i} className="other-users-div">
                                <div className="other-users-div-left">
                                    <img onError={({ currentTarget }) => {
                                        // console.log("i am erroring", currentTarget)
                                        currentTarget.onerror = null;
                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                    }} src={ele.profilePicture} alt="profile picture"></img>
                                    <div className="other-users-name">
                                        {ele.username}
                                    </div>
                                </div>

                                {!pending &&
                                    <button type="button" className='add-friend-button' onClick={() => handleAddFriendSubmit(ele)}>
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
    )
}


export default FriendsList
