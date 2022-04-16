import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { getServers } from "../../store/server";
import IndividualServerButton from "../IndividualServerButton";
import "./index.css"



function ServerBar({ user, socket, servers , isLoaded}) {
    const dispatch = useDispatch();
    const current_location = useLocation()

    const history = useHistory();

    const handleHomePush = () =>{
        history.push("/servers/me")
    }



    return (
        // onClick ={history.push("/servers/me")}
        <div  className="serverBar">
            <div onClick ={handleHomePush}  className="home-button">
                <i  className="fab fa-discord"></i>
            </div>
            <div className="server-divider">

            </div>
            {isLoaded &&
                <div className="your-servers">
                    {servers.map((ele, i) => (
                        <IndividualServerButton key={i} server={ele} user={user} socket={socket} />
                    ))}
                </div>
            }


        </div>
    );
}


export default ServerBar;
