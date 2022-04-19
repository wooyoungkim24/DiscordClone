import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import { getAllVoiceChannels,deleteServer, getServers, getTextChannels, leaveServer, getMembersAndAdmins } from "../../store/server";
import Chat from "../Chat";
import "./index.css"
import InvitePeopleModal from "../InvitePeopleModal";
import UserBar from "../UserBar";
import EditServerModal from "../EditServerModal";
import AdminPrivilegeModal from "../AdminPrivilegeModal";

function Server({ socket, servers, user, isFirstLoaded }) {
    const { id, textId } = useParams();
    // console.log('are you hitting here?', servers)
    const dispatch = useDispatch();

    const history = useHistory();
    let serverIds = [];
    servers.forEach(ele => {
        serverIds.push(ele.id)
    })

    if (!serverIds.includes(parseInt(id))) {
        history.push("/")
    }

    const membersAndAdmin = useSelector(state => {
        return state.myServers.membersAndAdmins
    })

    const [myServer, setMyServer] = useState({})
    const [myTextChannels, setMyTextChannels] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [isSecondLoaded, setIsSecondLoaded] = useState(false)
    const [showServerDropDown, setShowServerDropDown] = useState(false)
    const [showServerModal, setShowServerModal] = useState(false)
    // const textChannels = useSelector(state => {
    //     return state.myServers.textChannels
    // })
    const [showEditServer, setShowEditServer] = useState(false)
    const [showAdminPrivilege, setShowAdminPrivilege] = useState(false)



    const [textIndex, setTextIndex] = useState(0)

    useEffect(() => {
        if (isFirstLoaded) {
            const username = user.username
            const picture = user.profilePicture

            socket.emit("joinRoom", { username, roomId: `text${textId}`, picture })
            console.log('waht about here', servers)

            setMyServer(servers.find(ele => (ele.id === parseInt(id))))



            dispatch(getTextChannels(id))
                .then((channels) =>

                    setMyTextChannels(channels)
                )
                // .then(() => setEditPicture(myServer.serverImage))
                // .then(() => setEditName(myServer.serverName))
                .then(() => {
                    console.log("how many times")
                    setIsLoaded(true)
                })
        }

    }, [textId, isFirstLoaded])


    useEffect(() => {
        console.log("###is it here", isLoaded)
        if (isLoaded) {

            dispatch(getMembersAndAdmins(myServer.id))
            .then(() =>dispatch(getAllVoiceChannels(myServer.id)) )
            .then(() => setIsSecondLoaded(true))

        }
    }, [isLoaded])



    // const sendData = (id) => {

    //     const username = user.username
    //     console.log('text channel id', id)
    //     const roomId = id
    //     socket.emit("joinRoom", { username, roomId })

    // }
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
    const handleServerDropDown = () => {
        if (showServerDropDown) {
            setShowServerDropDown(false)
        }
        else {
            setShowServerDropDown(true)
        }
    }

    const handleAddPeople = () => {
        setShowServerModal(true)
    }

    const handleTextChange = (id) => {
        // sendData(id);
        history.push(`/servers/${myServer.id}/${id}`)
    }
    // console.log('empty?', myTextChannels)

    const handleDeleteServer = () => {
        dispatch(deleteServer(myServer.id))
        history.push("/");
    }

    const handleLeaveServer = () => {
        const payload = {
            userId: user.id,
            serverId: myServer.id
        }
        dispatch(leaveServer(payload))
        history.push("/");
    }
    const serverDropdown = () => {
        if (parseInt(myServer.userId) === parseInt(user.id)) {
            return (
                <div className="server-drop-down">
                    <button className="invite-people" type="button" onClick={handleAddPeople}>
                        Invite People
                    </button>
                    <button className="edit-server-button" type="button" onClick={() => setShowEditServer(true)}>
                        Edit Server
                    </button>
                    {showEditServer &&
                        <Modal onClose={() => setShowEditServer(false)}>
                            <EditServerModal setMyServer={setMyServer} server={myServer} user={user} setShowEditServer={setShowEditServer} />
                        </Modal>
                    }
                    <button className="admin-abilities-button" type="button" onClick={() => setShowAdminPrivilege(true)}>
                        Admin Privileges
                    </button>
                    {showAdminPrivilege &&
                        <Modal onClose={() => setShowAdminPrivilege(false)}>
                            <AdminPrivilegeModal setMyTextChannels={setMyTextChannels} server={myServer} user={user} setShowAdminPrivilege={setShowAdminPrivilege} />
                        </Modal>
                    }
                    <button className="leave-server" onClick={handleDeleteServer} type="button">
                        Delete Server
                    </button>
                </div>
            )
        } else {
            return (
                <div className="server-drop-down">
                    <button className="invite-people" type="button" onClick={handleAddPeople}>
                        Invite People
                    </button>
                    <button className="leave-server" onClick={handleLeaveServer} type="button">
                        Leave Server
                    </button>
                </div>
            )
        }
    }

    return (

        <>
            {isLoaded && isSecondLoaded &&

                <div className="server-page">

                    <div className="server-nav">
                        <div className="server-title">
                            <button type="button" onClick={handleServerDropDown}>
                                {myServer.serverName}
                            </button>
                            {showServerDropDown &&
                                serverDropdown()
                            }
                            {showServerModal &&
                                <Modal onClose={() => setShowServerModal(false)}>
                                    <InvitePeopleModal user={user} server={myServer} />
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

                            <UserBar socket={socket} user={user} />
                        </div>
                    </div>

                    <Chat socket={socket} user={user} key={parseInt(textId)} textId={textId} roomName={myTextChannels[textIndex].channelName} />


                    <div className="server-members">
                        <div className="admin-server">
                            <div className="admin-server-title">
                                Administrator
                            </div>
                            <div className="admin">
                                <img src={membersAndAdmin.admin.User.profilePicture}></img>
                                <div className="admin-online-dot">
                                    {onlineDot(membersAndAdmin.admin.User)}
                                </div>
                                <div className="server-admin-name">
                                    {membersAndAdmin.admin.User.username}
                                    {online(membersAndAdmin.admin.User)}

                                </div>
                            </div>
                        </div>
                        <div className="server-members">
                            <div className="server-members-title">
                                Members
                            </div>
                            <div className="server-members-list">
                                {membersAndAdmin.members.map(ele => {
                                    return (
                                        <div className="member-individual">
                                            <img src={ele.receivor.profilePicture}></img>
                                            <div className="member-online-dot">
                                                {onlineDot(ele.receivor)}
                                            </div>
                                            <div className="member-name">
                                                {ele.receivor.username}
                                                {online(ele.receivor)}

                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>


    )
}

export default Server;
