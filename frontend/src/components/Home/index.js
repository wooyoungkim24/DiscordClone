
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory, useRouteMatch, Link, useLocation } from "react-router-dom";

import { acceptInvite, getPendingServers, getServers, getTextChannels, rejectInvite } from "../../store/server";
import { getMyFriends, getDMs, createDM } from "../../store/session";
import DirectMessage from "../DirectMessage";
import FriendsList from "../FriendsList";
import UserBar from "../UserBar";
import "./index.css"


function Home({ inVoice, user, socket }) {

    let { path, url } = useRouteMatch()
    const [showFriends, setShowFriends] = useState(true)
    const [showInvites, setShowInvites] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showNewDm, setShowNewDm] = useState(false)

    const [dmId, setdmId] = useState("")
    const friends = useSelector(state => {
        return state.session.friends
    })
    const dms = useSelector(state => {
        return state.session.myMessages
    })

    const serverInvites = useSelector(state => {
        return state.myServers.pendingServers
    })
    useEffect(() => {
        dispatch(getMyFriends(user.id))
            .then(() => dispatch(getDMs(user.id)))
            .then(() => dispatch(getPendingServers(user.id)))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const handleYouGotAdded = (data) => {

        if (data.otherUser.id === user.id) {
            alert(`${data.user.username} added you!`)
        }

    }

    useEffect(() => {
        socket.on("youGotAdded", handleYouGotAdded)




        return () => {
            socket.off("youGotAdded", handleYouGotAdded)

        }
    }, [socket])


    const handleNewDm = () => {

        setShowNewDm(!showNewDm)
    }

    const selectFriend = (e) => {
        const id = parseInt(e.target.value)
        if (dmId === id) {
            return
        } else {
            setdmId(id)
        }
    }

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

    const updateDM = (data) => {
        if (parseInt(data.friendId) === parseInt(user.id)) {
            dispatch(getDMs(user.id))
        }
    }


    useEffect(() => {


        socket.on("updateDM", updateDM);

        return () => socket.off("updateDM", updateDM)
    }, [socket]);



    const handleCreateNewDm = () => {
        const payload = {
            userId: user.id,
            friendId: dmId
        }

        dispatch(createDM(payload))
        socket.emit("DMCreation", payload)
        setShowNewDm(false)
    }

    const handleSeeFriends = () => {
        setShowFriends(true)
        setShowInvites(false)
    }
    const handleCheckInvites = () => {
        setShowFriends(false)
        setShowInvites(true)
    }

    const handleServerAccept = (id) => {
        dispatch(acceptInvite(id))

    }
    const handleServerReject = (id) => {
        dispatch(rejectInvite(id))
    }

    return (


        <div className="home-container">
            <div className="home-nav">
                <button type="button" onClick={handleSeeFriends}>
                    Friends
                </button>
                <button type="button" onClick={handleCheckInvites}>
                    Invites
                </button>
            </div>



            <div className="home-friends">
                <div className="new-dm-button">
                    DIRECT MESSAGES
                    <button type="button" onClick={handleNewDm}>
                        <i className="fas fa-plus"></i>
                    </button>
                    {showNewDm &&
                        <div className="new-dm-popout">
                            <div className="new-dm-popout-title">
                                Select Friend
                            </div>
                            <div className="new-dm-popout-friends">
                                {friends.map(ele => {
                                    return (
                                        <div>
                                            <div className="new-dm-popout-friends-name">
                                                {ele.username}
                                            </div>
                                            <input
                                                type="radio"
                                                value={ele.id}
                                                onChange={selectFriend}
                                                checked={dmId === ele.id ? true : false}
                                            >
                                            </input>
                                        </div>
                                    )
                                })}
                            </div>
                            <button type="button" onClick={handleCreateNewDm}>
                                Create DM
                            </button>
                        </div>
                    }
                </div>
                <div className="active-dms">
                    {dms.map(ele => {
                        return (
                            <div key={ele.id} onClick={() => history.push(`/home/${ele.id}`)} className="list-element-active-dm">
                                <div className="active-dm-image-container">
                                    <img src={ele.profilePicture}></img>
                                    <div className="active-dm-online-dot">
                                        {onlineDot(ele)}
                                    </div>
                                </div>
                                {ele.username}
                            </div>
                            // <Link key={ele.id} to={`/home/${ele.id}`}>
                            //     {ele.username}
                            // </Link>
                        )
                    })}
                </div>

                <div>
                    <UserBar socket={socket} user={user} />
                </div>
            </div>


            <Switch>
                <Route exact path="/home">
                    {showFriends &&
                        <FriendsList user={user} friends={friends} socket={socket} />
                    }
                    {showInvites &&
                        <div className="home-invites">
                            {serverInvites.map(ele => {
                                return (
                                    <div className="invite-container-individual">
                                        <div className="inviter">
                                            <img src={ele.inviter.profilePicture}></img>
                                            {ele.inviter.username}
                                        </div>
                                        <div className="invites-you-to">
                                            Invites you to
                                        </div>
                                        <div className="server-invite">
                                            <img src={ele.server.serverImage}></img>
                                            {ele.server.serverName}
                                        </div>
                                        <div className="server-invite-buttons">
                                            <button type="button" onClick={() => handleServerAccept(ele.id)}>
                                                Accept
                                            </button>
                                            <button type="button" onClick={() => handleServerReject(ele.id)}>
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </Route>

                <Route exact path='/home/:id'>

                    <DirectMessage user={user} socket={socket} key={useLocation().pathname.split("/")[1]} />
                </Route>
            </Switch>









        </div>



    )
}


export default Home
