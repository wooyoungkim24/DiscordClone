
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { editServer, getServers } from "../../store/server";
import "./index.css"


function EditServerModal({ server, user, setShowEditServer, setMyServer }) {
    const dispatch = useDispatch()
    const [editPicture, setEditPicture] = useState(server.serverImage)
    const [editName, setEditName] = useState(server.serverName)
    const [imageError, setImageError] = useState(false)
    const [emptyName, setEmptyName] = useState(false)
    const handleEditPicture = (e) => {
        setEditPicture(e.target.value)
    }
    const handleEditName = (e) => {
        setEditName(e.target.value)
    }

    const handleEditServerSubmit = () => {

        const regex = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/;
        // console.log("where is the regex", regex.test(editName), editName)
        if (regex.test(editPicture) && editName) {
            // console.log("where is the regex", regex.test(editName))
            const payload = {
                serverId: server.id,
                serverImage: editPicture,
                serverName: editName
            }

            dispatch(editServer(payload))
                .then((server) => setMyServer(server))
                .then(() => dispatch(getServers(user.id)))

            setShowEditServer(false)
        }
        if(!regex.test(editPicture) && editName){
            setEmptyName(false)
            setImageError(true)
        }
        if(regex.test(editPicture) && !editName){
            setEmptyName(true)
            setImageError(false)
        }
        if(!regex.test(editPicture)){
            setImageError(true)
        }
        if(!editName){
            setEmptyName(true)
        }


    }
    return (
        <div className="edit-server-modal-container">
            <div className="edit-server-modal-title">
                Change your server
            </div>
            <form id='change-server-form' >
                {imageError &&
                    <div className="change-server-error">
                        Image not valid.
                    </div>
                }
                {emptyName &&
                    <div className="change-server-name-error">
                        Please give your server a name.
                    </div>
                }

                <div className="edit-server-picture-div">
                    CHANGE SERVER PICTURE
                    <input
                        type="text"
                        required
                        value={editPicture}
                        onChange={handleEditPicture}
                    >
                    </input>
                </div>
                <div className="edit-server-name-div">
                    CHANGE SERVER NAME
                    <input
                        type="text"
                        required
                        value={editName}
                        onChange={handleEditName}
                    >
                    </input>
                </div>
            </form>

            <div className="edit-server-button">
                <button type="button" form='change-server-form' onClick={handleEditServerSubmit} >
                    Submit
                </button>
            </div>

        </div>
    )
}

export default EditServerModal
