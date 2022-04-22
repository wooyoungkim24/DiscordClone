
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory, useRouteMatch, Link, useLocation } from "react-router-dom";

import { acceptInvite, getPendingServers, getServers, getTextChannels, rejectInvite } from "../../store/server";
import { getMyFriends, getDMs, createDM, deleteDM } from "../../store/session";
import DirectMessage from "../DirectMessage";
import FriendsList from "../FriendsList";
import UserBar from "../UserBar";
import "./index.css"


function Home({ inVoice, user, socket }) {
    console.log("are you rerendering???")
    const [showFriends, setShowFriends] = useState(true)
    const [showInvites, setShowInvites] = useState(false)
    const history = useHistory()
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showNewDm, setShowNewDm] = useState(false)
    const newDmRef = useRef();
    const [dmId, setdmId] = useState("")

    const [activeDmId, setActiveDmId] = useState()
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
        // if(showNewDm){
        //     setShowNewDm(false)
        // }else{
        document.getElementsByClassName("new-dm-focus")[0].focus();
        // }

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
                <div className="online-dot-dm">
                    <i class="fas fa-circle"></i>
                </div>
            )
        } else {
            return (
                <div className="offline-dot-dm">
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
        setActiveDmId(dmId)
        history.push(`/home/${dmId}`)

    }

    const handleSeeFriends = () => {
        history.push("/home")
        setShowFriends(true)
        setShowInvites(false)
        const buttonSelect = document.querySelector("#friends-home-button")
        const buttonUnSelect = document.querySelector("#invites-home-button")
        buttonSelect.classList.add("select")
        buttonUnSelect.classList.remove("select")
    }
    const handleCheckInvites = () => {
        history.push("/home")
        setShowFriends(false)
        setShowInvites(true)
        const buttonUnSelect = document.querySelector("#friends-home-button")
        const buttonSelect = document.querySelector("#invites-home-button")
        buttonSelect.classList.add("select")
        buttonUnSelect.classList.remove("select")
    }

    const handleServerAccept = (id) => {
        dispatch(acceptInvite(id))

    }
    const handleServerReject = (id) => {
        dispatch(rejectInvite(id))
    }


    const handleOutsideDmClick = (e) => {
        const ignore = document.querySelector(".new-dm-popout")
        let target = e.target
        if (document.activeElement === newDmRef.current) {
            return
        } else if (ignore && (target === ignore || ignore.contains(target))) {
            return
        }
        else {
            setShowNewDm(false)

        }
    }
    useEffect(() => {
        if (showNewDm) {
            document.addEventListener('click', handleOutsideDmClick);
        }
        return (() => {

            document.removeEventListener('click', handleOutsideDmClick);

        })
    }, [showNewDm])

    const handleDmPush = (ele) => {
        document.querySelectorAll(".list-element-active-dm").forEach(obj => {
            obj.classList.remove("select")
        })
        const newSelect = document.querySelector(`.list-element-active-dm.user${ele.id}`)
        newSelect.classList.add("select")

        history.push(`/home/${ele.id}`)
    }


    const handleLeaveDM = (id) => {
        const payload = {
            userId: user.id,
            otherId: id
        }
        // console.log("where are you gettin stuck")

        dispatch(deleteDM(payload))
        window.location.reload();

    }

    return (

        <div className="home-whole-container">
            <div className="home-container-left">
                <div className="home-nav">
                    <button type="button" id='friends-home-button' className="select" onClick={handleSeeFriends}>

                        <div>
                            <i className="fas fa-user"></i>
                        </div>
                        Friends
                    </button>
                    <button type="button" id='invites-home-button' onClick={handleCheckInvites}>
                        <div>
                            <i class="fas fa-user-plus"></i>
                        </div>

                        Invites
                    </button>
                </div>



                <div className="home-friends">
                    <div className="new-dm-button">
                        DIRECT &nbsp;MESSAGES
                        <div className="new-dm-focus"
                            tabIndex="0"
                            ref={newDmRef}
                            onFocus={() => setShowNewDm(true)}>
                            <button type="button" id='new-dm-button' onClick={handleNewDm}>
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>

                        {showNewDm &&
                            <div className="new-dm-popout">
                                <div className="new-dm-popout-title">
                                    Select Friend
                                </div>
                                <div className="new-dm-popout-friends">
                                    {friends.map(ele => {
                                        let dmIds = []

                                        dms.forEach(x => {
                                            dmIds.push(x.id)
                                        })
                                        if (!dmIds.includes(ele.id)) {
                                            return (
                                                <div className="dm-popout-friend-individual">
                                                    <div className="dm-popout-friend-individual-left">
                                                        <div className="dm-individual-picture">
                                                            <img onError={({ currentTarget }) => {
                                                                console.log("i am erroring", currentTarget)
                                                                currentTarget.onerror = null;
                                                                currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                            }} src={ele.profilePicture} alt="profile picture"></img>
                                                        </div>
                                                        <div className="new-dm-popout-friends-name">
                                                            {ele.username}
                                                        </div>
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
                                        }

                                    })}
                                </div>
                                <div className="create-dm-button">
                                    <button type="button" disabled={!dmId} onClick={handleCreateNewDm}>
                                        Create DM
                                    </button>
                                </div>

                            </div>
                        }
                    </div>
                    <div className="active-dms">
                        {dms.sort(function (a, b) {
                            return ((new Date(b.DirectMessages.updatedAt)) - (new Date(a.DirectMessages.updatedAt)))
                        }).map((ele, i) => {
                            if (activeDmId == ele.id) {
                                return (
                                    <div key={ele.id} onClick={() => handleDmPush(ele)} className={`list-element-active-dm user${ele.id} select`}>
                                        <div className="active-dm-image-container">
                                            <img onError={({ currentTarget }) => {
                                                console.log("i am erroring", currentTarget)
                                                currentTarget.onerror = null;
                                                currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                            }} src={ele.profilePicture} alt="profile picture"></img>
                                            <div className="active-dm-online-dot">
                                                {onlineDot(ele)}
                                            </div>
                                        </div>
                                        <div className="active-dm-name">
                                            {ele.username}
                                        </div>
                                        <div className="leave-button-div">
                                            <button type="button" className="leave-dm-button" onClick={() => handleLeaveDM(ele.id)}>
                                                Leave
                                            </button>
                                        </div>
                                    </div>
                                    // <Link key={ele.id} to={`/home/${ele.id}`}>
                                    //     {ele.username}
                                    // </Link>
                                )
                            } else {
                                return (
                                    <div key={ele.id} onClick={() => handleDmPush(ele)} className={`list-element-active-dm user${ele.id}`}>
                                        <div className="active-dm-image-container">
                                            <img onError={({ currentTarget }) => {
                                                console.log("i am erroring", currentTarget)
                                                currentTarget.onerror = null;
                                                currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                            }} src={ele.profilePicture} alt="profile picture"></img>

                                            {onlineDot(ele)}

                                        </div>
                                        <div className="active-dm-name">
                                            {ele.username}
                                        </div>
                                        <div className="leave-button-div">
                                            <button type="button" className="leave-dm-button" onClick={() => handleLeaveDM(ele.id)}>
                                                Leave
                                            </button>
                                        </div>
                                    </div>
                                    // <Link key={ele.id} to={`/home/${ele.id}`}>
                                    //     {ele.username}
                                    // </Link>
                                )
                            }

                        })}
                    </div>

                </div>
                <>
                    <UserBar socket={socket} user={user} />
                </>
            </div>
            <div className="home-container-right">
                <Switch>
                    <Route exact path="/home">
                        {showFriends &&
                            <FriendsList user={user} friends={friends} socket={socket} />
                        }
                        {showInvites &&
                            <div className="home-invites">
                                <div className="home-invites-title">
                                    These people want you in their servers!
                                </div>

                                {serverInvites.map(ele => {
                                    return (
                                        <div className="invite-container-individual">
                                            <div className="invite-container-left">
                                                <div className="inviter">
                                                    <img onError={({ currentTarget }) => {
                                                        console.log("i am erroring", currentTarget)
                                                        currentTarget.onerror = null;
                                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                    }} src={ele.inviter.profilePicture} alt="profile picture"></img>
                                                    {ele.inviter.username}
                                                </div>
                                                <div className="invites-you-to">
                                                    Invites you to
                                                </div>
                                                <div className="server-invite">
                                                    <img onError={({ currentTarget }) => {
                                                        console.log("i am erroring", currentTarget)
                                                        currentTarget.onerror = null;
                                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                    }} src={ele.server.serverImage} alt="profile picture"></img>
                                                    {ele.server.serverName}
                                                </div>
                                            </div>

                                            <div className="server-invite-buttons">
                                                <button type="button" className="accept-server" onClick={() => handleServerAccept(ele.id)}>
                                                    Accept
                                                </button>
                                                <button type="button" className="reject-server" onClick={() => handleServerReject(ele.id)}>
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

        </div>




    )
}


export default Home
