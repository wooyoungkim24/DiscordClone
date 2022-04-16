import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useParams, useHistory } from "react-router-dom";



function UserBar({user}) {
    return (
        <div className="user-bar-container">
            <div>
                <img src={user.profilePicture}></img>
            </div>
            <div>
                {user.username}
            </div>
            <div>
                <button type = "button">
                <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    )
}


export default UserBar;
