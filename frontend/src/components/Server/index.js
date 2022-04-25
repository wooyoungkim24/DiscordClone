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

function Server({ inVoice, setInVoice, setStream, setMadiaRecorder, stream, madiaRecorder, socket, user, isFirstLoaded }) {
    const { id, textId } = useParams();
    // console.log('are you hitting here?', servers)
    const dispatch = useDispatch();

    const history = useHistory();
    const servers = useSelector(state => {
        return state.myServers.myServers
    })

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
    const serverDropRef = useRef();
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
        if (inVoice && madiaRecorder) {
            // console.log("this is 0###")
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

            if (madiaRecorder) {
                if (madiaRecorder.state !== "inactive" && inVoice) {
                    // console.log("this is 2###")
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
                    if (navigator.mediaDevices) {
                        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                            setStream(stream)
                            setMadiaRecorder(new MediaRecorder(stream))
                        })
                    }

                }
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
            dispatch(getServers(user.id))


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

    }, [id, isFirstLoaded])


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
    }, [isLoaded, id,user])


    const settingVoiceMembers = (data) => {
        // console.log("%%%", voices[0], voices[0].voiceRoom, voiceId)
        // console.log("$$what am i working with", data.serverIds, servers)
        // console.log("what is my server id", data.serverId, id)
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
                <div className="online-dot-server">
                    <i className="fas fa-circle"></i>
                </div>
            )
        } else {
            return (
                <div className="offline-dot-server">
                    <i className="fas fa-circle"></i>
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

        // document.getElementsByClassName("server-dropdown-button")[0].focus();
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
            console.log("what happening", socket)
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




    const handleOutsideDropClick = (e) => {
        const ignore = document.querySelector(".server-drop-down-member")
        const ignore2 = document.querySelector(".server-drop-down-admin")
        const ignore3 = document.querySelector(".admin-privileges-container")
        const ignore4 = document.querySelector(".edit-server-modal-container")
        const ignore5 = document.querySelector(".edit-text-modal-container")

        let target = e.target
        // console.log("oogobooka &&&&&&&&&&&")
        if (document.activeElement === serverDropRef.current) {
            return
        } else if (ignore && (target === ignore || ignore.contains(target))) {
            return
        } else if (ignore2 && (target === ignore2 || ignore2.contains(target))) {
            return
        } else if (ignore3 && (target === ignore3 || ignore3.contains(target))) {
            return
        } else if (ignore4 && (target === ignore4 || ignore4.contains(target))) {
            return
        } else if (ignore5 && (target === ignore5 || ignore5.contains(target))) {
            // console.log('are you here yet 777')
            return
        }

        else {
            setShowServerDropDown(false)

        }
    }

    // useEffect(() => {
    //     if (showServerDropDown) {
    //         document.addEventListener('click', handleOutsideDropClick);
    //     }
    //     return (() => {

    //         document.removeEventListener('click', handleOutsideDropClick);

    //     })
    // }, [showServerDropDown])

    const handleRoomName = () => {
        if (myTextChannels[textIndex]) {
            return myTextChannels[textIndex].channelName
        } else {
            return myTextChannels[0].channelName
        }

    }
    return (

        <>
            {isLoaded && isSecondLoaded &&

                <div className="server-page">

                    <div className="server-nav">

                        <div className="server-dropdown-button"
                        // tabIndex="0"
                        // ref={serverDropRef}
                        // onFocus={() => setShowServerDropDown(true)}
                        >
                            <button type="button" onClick={handleServerDropDown}>
                                <div className="server-name">
                                    {myServer.serverName}
                                </div>
                                <i className="fas fa-angle-down"></i>
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
                                {myTextChannels.sort(function (a, b) {
                                    return a.id - b.id
                                }).map((ele, i) => {
                                    if (ele.id === parseInt(textId)) {
                                        if (textIndex !== i) {
                                            setTextIndex(i)
                                            // console.log('what is the index', textIndex)
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

                            {navigator.mediaDevices && madiaRecorder &&
                                <div className="server-voice-channels">
                                    {voiceChannels.map((ele, i) => {

                                        return (
                                            <div key = {i} className="voice-channel-individual">

                                                <button className="voice-channel-button" disabled={inVoice || !navigator.mediaDevices} onClick={() => handleEnterVoice(ele)}>
                                                    <i className="fas fa-bullhorn"></i>&nbsp;&nbsp;
                                                    {ele.channelName}
                                                </button>
                                                <div className="voice-chat-inside">
                                                    {voiceMembers.map((ele,i) => {
                                                        // console.log("$$$", ele)
                                                        return (
                                                            <div key = {i} className="voice-member">
                                                                <img onError={({ currentTarget }) => {
                                                                    // console.log("i am erroring", currentTarget)
                                                                    currentTarget.onerror = null;
                                                                    currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                                }} alt="profile picture" src={ele.profilePicture}></img>&nbsp;&nbsp;
                                                                {ele.username}
                                                            </div>
                                                        )

                                                    })}

                                                </div>


                                            </div>
                                        )

                                    })}
                                </div>
                            }

                        </div>


                        <div className="user-bar">

                            <UserBar serverId={id} voiceId={voiceId} voiceMembers={voiceMembers} setInVoice={setInVoice} inVoice={inVoice} socket={socket} user={user} />


                        </div>
                    </div>

                    <Chat socket={socket} user={user} key={parseInt(textId)} textId={textId} roomName={handleRoomName()} />


                    <div className="server-members">
                        <div className="admin-server">
                            <div className="admin-server-title">
                                ADMINISTRATOR
                            </div>
                            <div className="admin">
                                <div className="admin-image">
                                    <img onError={({ currentTarget }) => {
                                        // console.log("i am erroring", currentTarget)
                                        currentTarget.onerror = null;
                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                    }} alt="profile picture" src={membersAndAdmin.admin.User.profilePicture}></img>
                                    <div className="admin-online-dot">
                                        {onlineDot(membersAndAdmin.admin.User)}
                                    </div>
                                </div>

                                <div className="server-admin-name">
                                    {membersAndAdmin.admin.User.username}
                                    {online(membersAndAdmin.admin.User)}
                                </div>
                            </div>
                        </div>
                        <div className="members-server">
                            <div className="server-members-title">
                                MEMBERS
                            </div>
                            <div className="server-members-list">
                                {membersAndAdmin.members.map((ele,i) => {
                                    return (
                                        <div key = {i} className="member-individual">
                                            <div className="member-individual-image">
                                                <img onError={({ currentTarget }) => {
                                                    // console.log("i am erroring", currentTarget)
                                                    currentTarget.onerror = null;
                                                    currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                                }} alt="profile picture" src={ele.receivor.profilePicture}></img>
                                                <div className="member-online-dot">
                                                    {onlineDot(ele.receivor)}
                                                </div>
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
