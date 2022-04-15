import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch , useHistory} from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";

import "./index.css"



function IndividualServerButton({ server,user , socket}) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHover, setShowHover] = useState(false)
    const history = useHistory();


    // const sendData= () =>{

    //     const username = user.username
    //     console.log('what are my channels', textChannels[server.id][0].id)
    //     const roomId =textChannels[server.id][0].id
    //     socket.emit("joinRoom", {username, roomId})

    // }
    const handleServerClick = (e) =>{
        // sendData()
        history.push(`/servers/${server.id}/${textChannels[server.id][0].id}`)

    }

    const textChannels = useSelector(state =>{
        return state.myServers.textChannels
    })


    const handleMouseEnter = (e) => {
        setShowHover(true)
    }
    const handleMouseLeave = (e) => {
        setShowHover(false)
    }
    useEffect(() =>{
        dispatch(getTextChannels(server.id))
    }, [dispatch])

    return (
        <div className="single-server-container" onClick={handleServerClick}>
            <div className='single-your-server' >
                <img onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='single-server-image' src={server.serverImage}></img>
            </div>
            {showHover &&
                <div className="hover-bubble">
                    <div className="little-arrow">

                    </div>
                    <div className='single-server-hover'>
                        <div className="single-server-name">
                            {server.serverName}
                        </div>
                    </div>
                </div>

            }
        </div>

    )
}


export default IndividualServerButton;
