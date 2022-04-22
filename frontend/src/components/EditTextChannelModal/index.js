

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { editTextChannel } from "../../store/server";


function EditTextChannelModal({ channel, setShowEditModal, setMyTextChannels }) {
    console.log('starting', channel)
    const dispatch = useDispatch()

    const [channelName, setChannelName] = useState(channel.channelName)

    const handleChannelName = (e) => {
        setChannelName(e.target.value)
    }

    const handleEditSubmit = () => {
        const payload = {
            id: channel.id,
            channelName: channelName,
            serverId: channel.serverId
        }
        dispatch(editTextChannel(payload))
            .then((returnData) => setMyTextChannels([...returnData]))
        // console.log('waht sis returnb', returnData)
        // setMyTextChannels([...returnData])
        setShowEditModal(false)
    }

    return (
        <div className="edit-text-modal-container">
            <div className="edit-text-modal-title">
                Change channel name
            </div>
            <div className="edit-text-modal-input">
                <input
                    type="text"
                    required
                    value={channelName}
                    onChange={handleChannelName}
                >
                </input>
            </div>
            <div className="edit-text-button">
                <button type="button" onClick={handleEditSubmit}>
                    Submit Change
                </button>
            </div>

        </div>
    )
}



export default EditTextChannelModal
