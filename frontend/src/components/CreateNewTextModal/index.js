import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { createNewText } from "../../store/server";

function CreateNewTextModal({server,setMyTextChannels,setShowNewTextModal}) {

    const [newChannelName, setNewChannelName] = useState("")
    const dispatch = useDispatch()

    const handleNewChannelName = (e) =>{
        setNewChannelName(e.target.value)
    }

    const handleNewTextSubmit = () =>{
        const payload = {
            channelName: newChannelName,
            serverId: server.id
        }
        dispatch(createNewText(payload))
        .then((returnData) => setMyTextChannels([...returnData]))
        setShowNewTextModal(false)

    }
    return (
        <div className="create-text-modal-container">
            <div className="create-text-modal-title">
                Give your new text channel a name!
            </div>
            <div className="create-text-modal-input">
                <input
                    type="text"
                    required
                    value={newChannelName}
                    onChange={handleNewChannelName}
                >
                </input>
            </div>
            <button type="button" onClick={handleNewTextSubmit}>
                Create
            </button>
        </div>
    )
}


export default CreateNewTextModal
