import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import "./index.css"


function UserSettings({ socket }) {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        socket.disconnect()
        dispatch(sessionActions.logout())
    };



    return (
        <div className="user-settings-modal">
            Other stuff in the future :)
            <div className="logout-button">
                <button type="button"  onClick={logout}>
                    Logout
                </button>
            </div>

        </div>
    )
}


export default UserSettings
