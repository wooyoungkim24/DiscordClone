import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { getServers } from "../../store/server";
import IndividualServerButton from "../IndividualServerButton";
import "./index.css"



function ServerBar({ user, socket, servers , isLoaded}) {
    const dispatch = useDispatch();

    const history = useHistory();




    return (
        // onClick ={history.push("/servers/me")}
        <div className="serverBar">
            <div  className="home-button">
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
