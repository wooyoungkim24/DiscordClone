import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import { setVoices, getAllVoiceChannels, deleteServer, getServers, getTextChannels, leaveServer, getMembersAndAdmins, setInitialVoices } from "../../store/server";
import Chat from "../Chat";
import "./index.css"
import InvitePeopleModal from "../InvitePeopleModal";
import UserBar from "../UserBar";
import EditServerModal from "../EditServerModal";
import AdminPrivilegeModal from "../AdminPrivilegeModal";

function Server({ inVoice, setInVoice, setStream, setMadiaRecorder, stream, madiaRecorder, socket, servers, user, isFirstLoaded }) {
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

    const voiceChannels = useSelector(state => {
        return state.myServers.voiceChannels
    })

    const [myServer, setMyServer] = useState({})
    const [myTextChannels, setMyTextChannels] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [isSecondLoaded, setIsSecondLoaded] = useState(false)
    const [showServerDropDown, setShowServerDropDown] = useState(false)
    const [showServerModal, setShowServerModal] = useState(false)

    // const [voiceMembers, setVoiceMembers] = useState([])

    // let voiceId;
    const [voiceId, setVoiceId] = useState()
    // const textChannels = useSelector(state => {
    //     return state.myServers.textChannels
    // })
    const [showEditServer, setShowEditServer] = useState(false)
    const [showAdminPrivilege, setShowAdminPrivilege] = useState(false)




    const [textIndex, setTextIndex] = useState(0)

    const voiceMembers = useSelector(state => {
        return state.myServers.voices
    })


    useEffect(() => {
        if (inVoice) {
            console.log("this is 0###")
            let time = 700;
            madiaRecorder.start();

            var audioChunks = [];

            madiaRecorder.addEventListener("dataavailable", function (event) {
                audioChunks.push(event.data);
            });

            madiaRecorder.addEventListener("stop", function () {
                var audioBlob = new Blob(audioChunks);

                audioChunks = [];

                var fileReader = new FileReader();
                fileReader.readAsDataURL(audioBlob);
                fileReader.onloadend = function () {


                    var base64String = fileReader.result;
                    socket.emit("voice", base64String);

                };

                madiaRecorder.start();


                setTimeout(function () {
                    madiaRecorder.stop();
                }, time);
            });

            setTimeout(function () {
                madiaRecorder.stop();
            }, time);
        }

        // if ((!inVoice && madiaRecorder.state !== "inactive")) {
        //     console.log("this is 1###")
        //     stream.getTracks().forEach(track => track.stop());

        //     madiaRecorder.stop();
        //     // let time = 700
        //     // madiaRecorder.removeEventListener("dataavailable", function (event) {
        //     //     audioChunks.push(event.data);
        //     // });
        //     // madiaRecorder.removeEventListener("stop", function () {
        //     //     var audioBlob = new Blob(audioChunks);

        //     //     audioChunks = [];

        //     //     var fileReader = new FileReader();
        //     //     fileReader.readAsDataURL(audioBlob);
        //     //     fileReader.onloadend = function () {


        //     //         var base64String = fileReader.result;
        //     //         socket.emit("voice", base64String);

        //     //     };

        //     //     madiaRecorder.start();


        //     //     setTimeout(function () {
        //     //         madiaRecorder.stop();
        //     //     }, time);
        //     // });
        //     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        //         setStream(stream)
        //         setMadiaRecorder(new MediaRecorder(stream))
        //     })
        // }
        return (() => {
            let time = 700

            if (madiaRecorder.state !== "inactive" && inVoice) {
                console.log("this is 2###")
                stream.getTracks().forEach(track => track.stop());
                madiaRecorder.stop()
                // madiaRecorder.removeEventListener("dataavailable", function (event) {
                //     audioChunks.push(event.data);
                // });
                // madiaRecorder.removeEventListener("stop", function () {
                //     var audioBlob = new Blob(audioChunks);

                //     audioChunks = [];

                //     var fileReader = new FileReader();
                //     fileReader.readAsDataURL(audioBlob);
                //     fileReader.onloadend = function () {


                //         var base64String = fileReader.result;
                //         socket.emit("voice", base64String);

                //     };

                //     madiaRecorder.start();


                //     setTimeout(function () {
                //         madiaRecorder.stop();
                //     }, time);
                // });
                navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                    setStream(stream)
                    setMadiaRecorder(new MediaRecorder(stream))
                })
            }

        })



    }, [inVoice])








    useEffect(() => {
        if (isFirstLoaded) {
            const username = user.username
            const picture = user.profilePicture

            socket.emit("joinRoom", { username, roomId: `text${textId}`, picture })
            // console.log('waht about here', servers)

            setMyServer(servers.find(ele => (ele.id === parseInt(id))))

            // servers.forEach(ele =>{
            //     dispatch(getAllVoiceChannels(ele.id))
            // })


            dispatch(getTextChannels(id))
                .then((channels) =>

                    setMyTextChannels(channels)
                )
                // .then(() => setEditPicture(myServer.serverImage))
                // .then(() => setEditName(myServer.serverName))
                .then(() => {
                    // console.log("how many times")
                    setIsLoaded(true)
                })
        }

    }, [textId, id, isFirstLoaded])


    useEffect(() => {
        // console.log("###is it here", isLoaded)
        // socket.emit("allInVoice", { voiceRoom: `voice${voiceId}` })
        if (isLoaded) {

            dispatch(getMembersAndAdmins(id))
                .then(() => dispatch(getAllVoiceChannels(id)))
                .then((channels) => {
                    channels.forEach(ele => {

                        const payload = {
                            username: user.username,
                            id: ele.id
                        }

                        dispatch(setInitialVoices(payload))
                    })
                })
                .then(() => setIsSecondLoaded(true))


        }
    }, [isLoaded, id])


    const settingVoiceMembers = (data) => {
        // console.log("%%%", voices[0], voices[0].voiceRoom, voiceId)
        // console.log("$$what am i working with", data.serverIds, servers)
        console.log("what is my server id", data.serverId, id)
        if (data.serverId == id) {
            dispatch(setVoices(data.voices.voiceMembers))

        }


        // console.log("is it here xd", voices)
        // setVoiceMembers([...data.voices])



    }

    useEffect(() => {
        socket.on("updateVoices", settingVoiceMembers);
        socket.on("send", function (data) {
            // console.log("are you gettin ghits", data)
            var audio = new Audio(data);
            audio.play();
        });

        // socket.on("send", (data)=> console.log('is you coming here',data))

        return () => {
            socket.off("updateVoices", settingVoiceMembers)
            socket.off("send", function (data) {
                // console.log("are you gettin ghits", data)
                var audio = new Audio(data);
                audio.play();
            });
        }
    }, [socket, id])


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






    const handleEnterVoice = (ele) => {
        // console.log("%%%voicdid", ele.id)

        if (!inVoice) {
            setVoiceId(ele.id)
            // console.log("sugma",ele.id)
            socket.emit("joinVoice", { username: user.username, voiceRoomId: `voice${ele.id}` })
            // let ids = [];
            // servers.forEach(ele => {
            //     ids.push(ele.id)
            // })
            socket.emit("getVoicesPre", { serverId: id, voiceId: ele.id, username: user.username, picture: user.profilePicture })
            // socket.emit("allInVoice", { voiceRoomId: `voice${ele.id}` })
            setInVoice(true)
        }

    }


    const serverDropdown = () => {
        if (parseInt(myServer.userId) === parseInt(user.id)) {
            return (
                <div className="server-drop-down-admin">
                    <div className="invite-people-admin">
                        <button type="button" onClick={handleAddPeople}>
                            Invite People
                        </button>
                    </div>

                    <div className="edit-server-button-admin">
                        <button type="button" onClick={() => setShowEditServer(true)}>
                            Edit Server
                        </button>
                    </div>

                    {showEditServer &&
                        <Modal onClose={() => setShowEditServer(false)}>
                            <EditServerModal setMyServer={setMyServer} server={myServer} user={user} setShowEditServer={setShowEditServer} />
                        </Modal>
                    }
                    <div className="admin-abilities-button-admin">
                        <button type="button" onClick={() => setShowAdminPrivilege(true)}>
                            Admin Privileges
                        </button>
                    </div>

                    {showAdminPrivilege &&
                        <Modal onClose={() => setShowAdminPrivilege(false)}>
                            <AdminPrivilegeModal setMyTextChannels={setMyTextChannels} server={myServer} user={user} setShowAdminPrivilege={setShowAdminPrivilege} />
                        </Modal>
                    }
                    <div className="leave-server-admin">
                        <button onClick={handleDeleteServer} type="button">
                            Delete Server
                        </button>
                    </div>

                </div>
            )
        } else {
            return (
                <div className="server-drop-down-member">
                    <div className="invite-people-member">
                        <button type="button" onClick={handleAddPeople}>
                            Invite People
                        </button>
                    </div>
                    <div className="leave-server-member">
                        <button onClick={handleLeaveServer} type="button">
                            Leave Server
                        </button>
                    </div>


                </div>
            )
        }
    }

    return (

        <>
            {isLoaded && isSecondLoaded &&

                <div className="server-page">

                    <div className="server-nav">

                        <div className="server-dropdown-button">
                            <button type="button" onClick={handleServerDropDown}>
                                {myServer.serverName}
                            </button>
                        </div>

                        {showServerDropDown &&
                            serverDropdown()
                        }
                        {showServerModal &&
                            <Modal onClose={() => setShowServerModal(false)}>
                                <InvitePeopleModal user={user} server={myServer} />
                            </Modal>
                        }
                        <div className="channels">
                            <div className="server-text-channels">
                                {myTextChannels.map((ele, i) => {
                                    if (ele.id === parseInt(textId)) {
                                        if (textIndex !== i) {
                                            setTextIndex(i)

                                        }
                                        return (
                                            <div key={i} className="selected-text-channel">
                                                <button type="button">
                                                    <i className="fas fa-hashtag"></i> &nbsp;&nbsp;
                                                    {ele.channelName}
                                                </button>
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div key={i} className="unselected-text-channel">
                                                <button type="button" onClick={() => handleTextChange(ele.id)}>
                                                    <i className="fas fa-hashtag"></i> &nbsp;&nbsp;
                                                    {ele.channelName}
                                                </button>

                                            </div>
                                        )
                                    }

                                })}
                            </div>

                            <div className="server-voice-channels">
                                {voiceChannels.map((ele, i) => {
                                    return (
                                        <div className="voice-channel-individual">

                                            <button className="voice-channel-button" disabled={inVoice} onClick={() => handleEnterVoice(ele)}>
                                                <i className="fas fa-bullhorn"></i>&nbsp;&nbsp;
                                                {ele.channelName}
                                            </button>
                                            <div className="voice-chat-inside">
                                                {voiceMembers.map(ele => {
                                                    // console.log("$$$", ele)
                                                    return (
                                                        <div className="voice-member">
                                                            <img src={ele.profilePicture}></img>&nbsp;&nbsp;
                                                            {ele.username}
                                                        </div>
                                                    )

                                                })}

                                            </div>


                                        </div>
                                    )

                                })}
                            </div>
                        </div>


                        <div className="user-bar">

                            <UserBar serverId={id} voiceId={voiceId} voiceMembers={voiceMembers} setInVoice={setInVoice} inVoice={inVoice} socket={socket} user={user} />


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
