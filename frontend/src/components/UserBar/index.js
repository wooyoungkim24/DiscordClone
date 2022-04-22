import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import UserSettings from "../UserSettings";
import { setVoices } from "../../store/server";

function UserBar({ serverId, voiceId, voiceMembers, setVoiceMembers, user, socket, inVoice, setInVoice }) {


    const [showUserSettings, setShowUserSettings] = useState(false)
    const dispatch = useDispatch();

    const onlineDot = (ele) => {
        console.log("am i online", ele, ele.online)
        if (ele.online) {
            return (
                <div className="online-dot-user">
                    <i className="fas fa-circle"></i>
                </div>
            )
        } else {
            return (
                <div className="offline-dot-user">
                    <i className="fas fa-circle"></i>
                </div>
            )
        }
    }


    const settingVoiceMembersAfter = (data) => {
        // console.log("%%%", voices[0], voices[0].voiceRoom, voiceId)
        // console.log("$$now what", data.serversIds, servers)
        console.log("what is my server id hang", data.serverId, serverId)
        if (data.serverId == serverId) {
            dispatch(setVoices(data.voices.voiceMembers))

        }


    }

    useEffect(() => {
        socket.on("updateVoicesAfter", settingVoiceMembersAfter);

        // socket.on("send", (data)=> console.log('is you coming here',data))

        return () => socket.off("updateVoicesAfter", settingVoiceMembersAfter);
    }, [socket, serverId])

    const handleHangUp = () => {

        socket.emit("leaveVoice", { username: user.username })
        // let ids = [];
        // servers.forEach(ele => {
        //     ids.push(ele.id)
        // })

        socket.emit("getVoicesHangUp", { voiceId, username: user.username, serverId: serverId })
        // socket.emit("allInVoiceAfter", { voiceRoomId: `voice${voiceId}` })
        // voiceId = undefined

        setInVoice(false)

        // promiseStream.then((stream) => {
        //     console.log("testing testing 123")
        //     // stream.stop()
        //     const tracks = stream.getTracks()
        //     tracks[0].stop();
        //     return
        // })
    }


    return (
        <div className="user-bar-include-voice">
            {inVoice &&
                <div className="in-voice-user">
                    <button onClick={handleHangUp}>
                        <i className="fas fa-phone-slash"></i>&nbsp;&nbsp;
                        Hang Up
                    </button>
                </div>
            }

            <div className="user-bar-container">
                <div className="user-bar-image">
                    <img onError={({currentTarget}) => {
                        console.log("i am erroring", currentTarget)
                        currentTarget.onerror = null;
                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                    }} src={user.profilePicture} alt="profile picture"></img>
                    <div>
                        {onlineDot(user)}
                    </div>
                </div>
                <div className="user-bar-name">
                    {user.username}
                </div>
                <div className="user-bar-settings">
                    <button type="button" onClick={() => setShowUserSettings(true)}>
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                {showUserSettings &&
                    <Modal onClose={() => setShowUserSettings(false)}>
                        <UserSettings socket={socket} />
                    </Modal>
                }
            </div>
        </div>

    )
}


export default UserBar;
