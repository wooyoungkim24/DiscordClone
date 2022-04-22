import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { createNewServer } from "../../store/server";
import "./index.css"

function NewServerModal({ user, setNewServer }) {
    const dispatch = useDispatch()
    const [photoURL, setPhotoURL] = useState("")
    const [serverName, setServerName] = useState("")
    const [imageError, setImageError] = useState(false)
    const [emptyName, setEmptyName] = useState(false)
    const updatePhotoURL = (e) => {
        setPhotoURL(e.target.value)
    }
    const updateServerName = (e) => {
        setServerName(e.target.value)
    }


    const handleNewServerSubmit = () => {
        const regex = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
        if (regex.test(photoURL) && serverName) {
            const payload = {
                serverImage: photoURL,
                serverName,
                userId: user.id
            }
            dispatch(createNewServer(payload))
            setNewServer(false)
        }
        if(!regex.test(photoURL) && serverName){
            setEmptyName(false)
            setImageError(true)
        }
        if(regex.test(photoURL) && !serverName){
            setEmptyName(true)
            setImageError(false)
        }
        if(!regex.test(photoURL)){
            setImageError(true)
        }
        if(!serverName){
            setEmptyName(true)
        }


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
                {imageError &&
                    <div className="add-server-error">
                        Image not valid.
                    </div>
                }
                {emptyName &&
                    <div className="add-server-name-error">
                        Please give your server a name.
                    </div>
                }
                SERVER PHOTO URL
                <div className="new-server-photo-upload-input">
                    <input
                        type="text"
                        placeholder="Photo URL"
                        required
                        value={photoURL}
                        onChange={updatePhotoURL}
                    >
                    </input>
                </div>

            </div>
            <div className="new-server-name">
                SERVER NAME
                <div className="new-server-name-input">
                    <input
                        type="text"
                        placeholder="Server Name"
                        required
                        value={serverName}
                        onChange={updateServerName}
                    >
                    </input>
                </div>

            </div>
            <div className="new-server-buttons">
                <button type="button" onClick={() => setNewServer(false)} id="new-server-back-button">
                    Back
                </button>
                <button type="button" onClick={handleNewServerSubmit} id="new-server-create-button">
                    Create
                </button>
            </div>

        </div>
    )
}

export default NewServerModal
