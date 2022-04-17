
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory, useRouteMatch, Link , useLocation} from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";
import { getMyFriends, getDMs, createDM } from "../../store/session";
import DirectMessage from "../DirectMessage";
import FriendsList from "../FriendsList";
import UserBar from "../UserBar";

function Home({ user ,socket}) {

    let { path, url } = useRouteMatch()

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
    useEffect(() => {
        dispatch(getMyFriends(user.id))
            .then(() => dispatch(getDMs(user.id)))
            .then(() => setIsLoaded(true))
    }, [dispatch])




    const handleNewDm = () => {
        setShowNewDm(true)
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

    const updateDM = (data) =>{
        if(parseInt(data.friendId) === parseInt(user.id)){
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
        socket.emit("DMCreation", payload )
        setShowNewDm(false)
    }

    return (


        <div className="home-container">
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
                    <UserBar  user = {user}/>
                </div>
            </div>

            <Switch>
                <Route exact path ="/home">
                    <FriendsList user = {user} friends = {friends} socket = {socket}/>
                </Route>
                <Route exact path={`/home/:id`}>
                    <DirectMessage user={user} socket={socket} key={useLocation().pathname.split("/")[1]}/>
                </Route>
            </Switch>









        </div>



    )
}


export default Home
