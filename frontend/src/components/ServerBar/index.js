import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { getServers } from "../../store/server";
import IndividualServerButton from "../IndividualServerButton";
import "./index.css"
import { Modal } from "../../context/modal"
import NewServerModal from "../NewServerModal";



function ServerBar({inVoice, user, socket, servers , isLoaded}) {
    const dispatch = useDispatch();
    const current_location = useLocation()
    const [newServer, setNewServer] = useState(false)
    const history = useHistory();

    const handleHomePush = () =>{
        history.push("/home")
    }



    return (
        // onClick ={history.push("/servers/me")}
        <div  className="serverBar">
            <button onClick ={handleHomePush} disabled ={inVoice} className="home-button">
                <i  className="fab fa-discord"></i>
            </button>
            <div className="server-divider">

            </div>
            {isLoaded &&
                <div className="your-servers">
                    {servers.map((ele, i) => (
                        <IndividualServerButton inVoice = {inVoice} key={i} server={ele} user={user} socket={socket} />
                    ))}
                </div>
            }

            <div className="new-server">
                <i onClick = {() => setNewServer(true)} className="fas fa-plus"></i>
            </div>

            {newServer &&
                <Modal onClose={() => setNewServer(false)}>
                    <NewServerModal user={user} setNewServer = {setNewServer}/>
                </Modal>
            }

        </div>
    );
}


export default ServerBar;
