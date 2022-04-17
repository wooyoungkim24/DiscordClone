import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import { Modal } from "../../context/modal"


function UserBar({user}) {


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


    return (
        <div className="user-bar-container">
            <div>
                <img src={user.profilePicture}></img>
                <div>
                    {onlineDot(user )}
                </div>
            </div>
            <div>
                {user.username}
            </div>
            <div>
                <button type = "button">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            {showUserSettings &&
                <Modal onClose = {() => setShowUserSettings(false)}>

                </Modal>
            }
        </div>
    )
}


export default UserBar;
