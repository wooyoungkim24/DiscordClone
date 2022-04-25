import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"
import { getAllNotAdminMembers, getTextChannel, kickServer, deleteTextChannel, getMembersAndAdmins, createNewText } from "../../store/server";
import EditTextChannelModal from "../EditTextChannelModal";
import CreateNewTextModal from "../CreateNewTextModal";
import "./index.css"
import { Socket } from "socket.io-client";

function AdminPrivilegeModal({ id, socket, server, user, setShowAdminPrivilege, setMyTextChannels }) {
    const dispatch = useDispatch()
    const [showKick, setShowKick] = useState(false)
    const [showEditText, setShowEditText] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showNewTextModal, setShowNewTextModal] = useState(false)
    const [currChannelIndex, setCurrChannelIndex] = useState(0)
    const [newChannelName, setNewChannelName] = useState()


    const handleNewChannelName = (e) => {
        // console.log("value", typeof e.target.value)
        setNewChannelName(e.target.value)

    }
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
        dispatch(getMembersAndAdmins(server.id))
    }

    const handleKickPush = () => {
        setShowNewTextModal(false)
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
        setShowNewTextModal(false)
    }

    const handleEditClick = (i) => {
        setCurrChannelIndex(i)
        setShowEditModal(true)
    }

    const handleNewTextSubmit = () => {

        const payload = {
            channelName: newChannelName,
            serverId: server.id
        }
        dispatch(createNewText(payload))
            .then((returnData) => setMyTextChannels([...returnData]))
        setShowNewTextModal(false)

    }
    const handleDeleteClick = (channel) => {
        if (myTextChannels.length > 1) {
            const payload = {
                id: channel.id,
                serverId: channel.serverId
            }
            dispatch(deleteTextChannel(payload))
                .then((returnData) => setMyTextChannels([...returnData]))
                // .then(()=> window.location.reload())

            socket.emit("deletedText", {id: id} )

        } else {
            // window.alert("That's your last channel, can't delete that!");
            alert("That's your last channel, can't delete that!");
        }
    }
    // function handleBrokenImg(el) {

    //     /*
    //     Perhaps show different broken image icons depending on various conditions
    //     Or add some style to it.. a border, background color, whatever..
    //   */
    //     el.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
    // }
    return (
        <div className="admin-privileges-container">
            <div className="admin-top">
                Admin Privileges
                <div className="admin-buttons">
                    <button type="button" id='kick-members-category' onClick={handleKickPush}>
                        Kick Members
                    </button>
                    <button type="button" id='edit-text-category' onClick={handleEditPush}>
                        Edit Text Channels
                    </button>
                    <button type="button" onClick={handleNewTextPush}>
                        Create Text Channel
                    </button>
                </div>



            </div>
            {showNewTextModal &&

                <div className="create-text-modal-container">
                    <div className="create-text-modal-title">
                        Give your new text channel a name!
                    </div>
                    <div className="create-text-modal-input">
                        <form id='new-text-form' onSubmit={handleNewTextSubmit}>
                            <input
                                type="text"
                                required
                                value={newChannelName}
                                onChange={handleNewChannelName}
                            >
                            </input>
                        </form>

                    </div>
                    <div className="create-text-button">
                        <button type="submit" form="new-text-form" >
                            Create
                        </button>
                    </div>

                </div>

            }
            {showKick &&
                <div className="kick-members-div">
                    {notAdminMembers.map(ele => {
                        return (
                            <div className="kick-list-individual">
                                <div className="kick-individual-left">
                                    <img onError={({ currentTarget }) => {
                                        // console.log("i am erroring", currentTarget)
                                        currentTarget.onerror = null;
                                        currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                    }} src={ele.receivor.profilePicture} alt="profile picture"></img>&nbsp;&nbsp;&nbsp;
                                    {ele.receivor.username}
                                </div>

                                <button type="button" onClick={() => handleKickUser(ele)}>
                                    KICK USER
                                </button>
                            </div>
                        )
                    })}
                </div>
            }
            {showEditText &&
                <div className="edit-text-div">
                    {myTextChannels.sort(function (a, b) {
                        return a.id - b.id
                    }).map((ele, i) => {
                        return (
                            <div className="edit-text-list-individual">
                                {ele.channelName}
                                <div className="edit-text-buttons">
                                    <button type="button" id='edit-text-channel-button' onClick={() => handleEditClick(i)}>
                                        Edit
                                    </button>

                                    <button type="button" id='delete-text-channel-button' onClick={() => handleDeleteClick(ele)}>
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
