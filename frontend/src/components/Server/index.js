import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import { getServers, getTextChannels } from "../../store/server";
import Chat from "../Chat";
import "./index.css"
import InvitePeopleModal from "../InvitePeopleModal";
import UserBar from "../UserBar";

function Server({ socket, servers, user, isFirstLoaded }) {
    const { id, textId } = useParams();

    const dispatch = useDispatch();


    const [myServer, setMyServer] = useState({})
    const [myTextChannels, setMyTextChannels] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [showServerDropDown, setShowServerDropDown] = useState(false)
    const [showServerModal, setShowServerModal] = useState(false)
    // const textChannels = useSelector(state => {
    //     return state.myServers.textChannels
    // })

    const [textIndex, setTextIndex] = useState(0)

    const history = useHistory();
    useEffect(() => {
        if (isFirstLoaded) {
            const username = user.username
            const picture = user.profilePicture

            socket.emit("joinRoom", { username, roomId: `text${textId}`, picture })


            setMyServer(servers.find(ele => (ele.id === parseInt(id))))
            dispatch(getTextChannels(id)).then((channels) => setMyTextChannels(channels))
                .then(() => setIsLoaded(true))
        }

    }, [textId, isFirstLoaded])

    // const sendData = (id) => {

    //     const username = user.username
    //     console.log('text channel id', id)
    //     const roomId = id
    //     socket.emit("joinRoom", { username, roomId })

    // }

    const handleServerDropDown = () => {
        if (showServerDropDown) {
            setShowServerDropDown(false)
        }
        else {
            setShowServerDropDown(true)
        }
    }

    const handleAddPeople = () =>{
        setShowServerModal(true)
    }

    const handleTextChange = (id) => {
        // sendData(id);
        history.push(`/servers/${myServer.id}/${id}`)
    }
    // console.log('empty?', myTextChannels)

    return (

        <>
            {isLoaded &&

                <div className="server-page">

                    <div className="server-nav">
                        <div className="server-title">
                            <button type="button" onClick={handleServerDropDown}>
                                {myServer.serverName}
                            </button>
                            {showServerDropDown &&
                                <div className="server-drop-down">
                                    <button className="invite-people" type="button" onClick={handleAddPeople}>
                                        Invite People
                                    </button>
                                    <button className="leave-server" type="button">
                                        Leave Server
                                    </button>
                                </div>
                            }
                            {showServerModal &&
                                <Modal onClose = {() => setShowServerModal(false)}>
                                    <InvitePeopleModal user = {user} server={myServer} />
                                </Modal>
                            }

                        </div>
                        <div className="server-text-channels">
                            {myTextChannels.map((ele, i) => {
                                if (ele.id === parseInt(textId)) {
                                    if (textIndex !== i) {
                                        setTextIndex(i)

                                    }
                                    return (
                                        <div key={i} className="selected-text-channel">
                                            <button type="button">
                                                {ele.channelName}
                                            </button>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div key={i} className="unselected-text-channel">
                                            <button type="button" onClick={() => handleTextChange(ele.id)}>
                                                {ele.channelName}
                                            </button>

                                        </div>
                                    )
                                }

                            })}
                        </div>
                        <div className="server-voice-channels">

                        </div>
                        <div className="user-bar">
                            <UserBar  user = {user}/>
                        </div>
                    </div>

                    <Chat socket={socket} user={user} key={parseInt(textId)} textId={textId} roomName={myTextChannels[textIndex].channelName} />


                    <div className="server-members">

                    </div>
                </div>
            }
        </>


    )
}

export default Server;
