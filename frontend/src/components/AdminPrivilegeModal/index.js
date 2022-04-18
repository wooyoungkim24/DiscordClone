import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import {getAllNotAdminMembers, getTextChannel, kickServer, deleteTextChannel } from "../../store/server";
import EditTextChannelModal from "../EditTextChannelModal";
import CreateNewTextModal from "../CreateNewTextModal";


function AdminPrivilegeModal({ server, user, setShowAdminPrivilege, setMyTextChannels }) {
    const dispatch = useDispatch()
    const [showKick, setShowKick] = useState(false)
    const [showEditText, setShowEditText] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showNewTextModal, setShowNewTextModal] = useState(false)
    const [currChannelIndex, setCurrChannelIndex] = useState(0)

    const notAdminMembers = useSelector(state => {
        return state.myServers.nonAdminServerMembers
    })

    const myTextChannels = useSelector(state => {
        return state.myServers.myTextChannels
    })

    useEffect(() => {
        dispatch(getAllNotAdminMembers(server.id))
        dispatch(getTextChannel(server.id))
    }, [dispatch])


    const handleKickUser = (member) => {
        const payload = {
            userId: member.userId,
            serverId: member.serverId
        }
        dispatch(kickServer(payload))
    }

    const handleKickPush = () => {
        setShowKick(true)
        setShowEditText(false)
    }
    const handleNewTextPush = () => {
        setShowNewTextModal(true)
        setShowKick(false)
        setShowEditText(false)
    }

    const handleEditPush = () => {
        setShowKick(false)
        setShowEditText(true)
    }

    const handleEditClick = (i) => {
        setCurrChannelIndex(i)
        setShowEditModal(true)
    }

    const handleDeleteClick = (channel) => {
        if (myTextChannels.length > 1) {
            const payload = {
                id: channel.id,
                serverId: channel.serverId
            }
            dispatch(deleteTextChannel(payload))
                .then((returnData) => setMyTextChannels([...returnData]))
        } else {
            // window.alert("That's your last channel, can't delete that!");
            alert("That's your last channel, can't delete that!");
        }
    }
    return (
        <div className="admin-privileges-container">
            <div className="admin-buttons">
                <button type="button" onClick={handleKickPush}>
                    Kick Members
                </button>
                <button type="button" onClick={handleEditPush}>
                    Edit Text Channels
                </button>
                <button type="button" onClick={handleNewTextPush}>
                    Create Text Channel
                </button>
                {showNewTextModal &&
                    <Modal onClose={() => setShowNewTextModal(false)}>
                        <CreateNewTextModal setShowNewTextModal = {setShowNewTextModal} setMyTextChannels={setMyTextChannels} server={server}/>
                    </Modal>
                }

            </div>
            {showKick &&
                <div className="kick-members-div">
                    {notAdminMembers.map(ele => {
                        return (
                            <div className="kick-list-individual">
                                <img src={ele.receivor.profilePicture}></img>
                                {ele.receivor.username}
                                <button type="button" onClick={() => handleKickUser(ele)}>
                                    Kick this user
                                </button>
                            </div>
                        )
                    })}
                </div>
            }
            {showEditText &&
                <div className="edit-text-div">
                    {myTextChannels.map((ele, i) => {
                        return (
                            <div className="edit-text-list-individual">
                                {ele.channelName}
                                <div className="edit-text-buttons">
                                    <button type="button" onClick={() => handleEditClick(i)}>
                                        Edit
                                    </button>

                                    <button type="button" onClick={() => handleDeleteClick(ele)}>
                                        Delete
                                    </button>
                                </div>


                            </div>
                        )
                    })}
                    {showEditModal &&
                        <Modal onClose={() => setShowEditModal(false)}>
                            <EditTextChannelModal setMyTextChannels={setMyTextChannels} channel={myTextChannels[currChannelIndex]} setShowEditModal={setShowEditModal} />
                        </Modal>
                    }
                </div>
            }
        </div>
    )
}


export default AdminPrivilegeModal
