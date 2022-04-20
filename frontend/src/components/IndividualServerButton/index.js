import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch , useHistory} from "react-router-dom";
import { getServers, getTextChannels, getAllVoiceChannels } from "../../store/server";

import "./index.css"



function IndividualServerButton({ inVoice, server,user , socket}) {
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

        dispatch(getAllVoiceChannels(server.id))
        history.push(`/servers/${server.id}/${textChannels[server.id][0].id}`)

    }

    const textChannels = useSelector(state =>{
        return state.myServers.textChannels
    })

    // useEffect (() =>{
    //     let button = document.querySelector('.single-your-server')
    //     console.log('what is button', button)
    //     button.addEventListener("mouseenter",() =>{
    //         console.log(button.classList)
    //         button.classList.add("hover")
    //         console.log("after", button.classList)
    //     })
    //     button.addEventListener("mouseleave",() =>{
    //         button.classList.remove("hover")
    //     })
    //     return (() => {
    //         button.removeEventListener("mouseenter",() =>{
    //             button.classList.add("hover")
    //         })
    //         button.removeEventListener("mouseleave",() =>{
    //             button.classList.remove("hover")
    //         })
    //     })
    // }, [])

    const handleMouseEnter = (e) => {

        // e.target.classList.add("hover")
        // console.log(e.target)
        setShowHover(true)
    }
    const handleMouseLeave = (e) => {
        // e.target.classList.remove("hover")
        // console.log(e.target)
        setShowHover(false)
    }
    useEffect(() =>{
        dispatch(getTextChannels(server.id))
    }, [dispatch])

    return (
        <div className="single-server-container">
            <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}  onClick={handleServerClick}  disabled = {inVoice} className='single-your-server' >
                <img className='single-server-image' src={server.serverImage}></img>
            </button>
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
