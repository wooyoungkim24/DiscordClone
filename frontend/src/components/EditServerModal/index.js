
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { editServer, getServers } from "../../store/server";
import "./index.css"


function EditServerModal({ server, user, setShowEditServer, setMyServer }) {
    const dispatch = useDispatch()
    const [editPicture, setEditPicture] = useState(server.serverImage)
    const [editName, setEditName] = useState(server.serverName)
    const handleEditPicture = (e) => {
        setEditPicture(e.target.value)
    }
    const handleEditName = (e) => {
        setEditName(e.target.value)
    }

    const handleEditServerSubmit = () => {

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
    return (
        <div className="edit-server-modal-container">
            <div className="edit-server-modal-title">
                Change your server
            </div>
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
            <div className="edit-server-button">
                <button type="button" onClick={handleEditServerSubmit}>
                    Submit
                </button>
            </div>

        </div>
    )
}

export default EditServerModal
