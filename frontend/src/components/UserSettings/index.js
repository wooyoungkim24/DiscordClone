import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';

function UserSettings() {
    const dispatch = useDispatch();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
      };



    return (
        <div>
            Other Stuff
            <button type= "button" onClick={logout}>
                Logout
            </button>
        </div>
    )
}


export default UserSettings
