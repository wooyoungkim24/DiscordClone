import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import UserSettings from "../UserSettings";

function UserBar({ voiceId, voiceMembers, setVoiceMembers, user, socket, inVoice, setInVoice }) {


    const [showUserSettings, setShowUserSettings] = useState(false)

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


    const settingVoiceMembers = (data) => {
        console.log("$$$why", data, user.username)
        if (data.inVoice[0].username === user.username) {
            let voice = data.inVoice[0]

            let working = [...voiceMembers]
            let workingIndex = working.findIndex(ele => ele.username === voice.username)
            working.splice(workingIndex, 1)
            // console.log("are you not hitting here", voices)
            setVoiceMembers([...working])
        }

    }

    useEffect(() => {
        socket.on("inVoiceAfter", settingVoiceMembers);

        // socket.on("send", (data)=> console.log('is you coming here',data))

        return () => socket.off("inVoiceAfter", settingVoiceMembers)
    }, [socket])

    const handleHangUp = () => {

        socket.emit("leaveVoice", { username: user.username })


        // socket.emit("allInVoiceAfter", { voiceRoomId: `voice${voiceId}` })

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
                <div>
                    <button onClick={handleHangUp}>
                        Hang Up
                    </button>
                </div>
            }

            <div className="user-bar-container">
                <div>
                    <img src={user.profilePicture}></img>
                    <div>
                        {onlineDot(user)}
                    </div>
                </div>
                <div>
                    {user.username}
                </div>
                <div>
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
