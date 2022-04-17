import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { createNewServer } from "../../store/server";


function NewServerModal({ user, setNewServer }) {
    const dispatch = useDispatch()
    const [photoURL, setPhotoURL] = useState("")
    const [serverName, setServerName] = useState("")

    const updatePhotoURL = (e) => {
        setPhotoURL(e.target.value)
    }
    const updateServerName = (e) => {
        setServerName(e.target.value)
    }


    const handleNewServerSubmit = () =>{
        const payload = {
            serverImage: photoURL,
            serverName,
            userId: user.id
        }
        dispatch(createNewServer(payload))
        setNewServer(false)

    }

    return (
        <div className="new-server-modal-container">
            <div className="new-server-modal-title">
                <div className="new-server-modal-title-top">
                    Customize your server
                </div>
                <div className="new-server-modal-title-bottom">
                    Give your new server a personality with a name and an icon.
                </div>
            </div>
            <div className="new-server-photo-upload">
                <input

                    type="text"
                    placeholder="Photo URL"
                    required
                    value={photoURL}
                    onChange={updatePhotoURL}
                >
                </input>
            </div>
            <div className="new-server-name">
                <input

                    type="text"
                    placeholder="Server Name"
                    required
                    value={serverName}
                    onChange={updateServerName}
                >
                </input>
            </div>
            <div className="new-server-buttons">
                <button type="button"  onClick ={() => setNewServer(false)}id="new-server-back-button">
                    Back
                </button>
                <button type = "button" onClick = {handleNewServerSubmit} id= "new-server-create-button">
                    Create
                </button>
            </div>

        </div>
    )
}

export default NewServerModal
