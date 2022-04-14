import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch , useParams} from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";
import Chat from "../Chat";
import "./index.css"

function Server({socket}) {
    const { id } = useParams();

    const dispatch = useDispatch();

    const textChannels = useSelector(state =>{
        return state.myServers.textChannels
    })
    const myServers = useSelector(state =>{
        return state.myServers.myServers
    })

    // let myServer;
    // myServers.forEach(ele =>{
    //     if(ele.id === id){
    //         myServer = ele
    //     }
    // })


    return (
        <div className="server-page">
            <div className="server-nav">
                <div className="server-title">
                    Hello
                </div>
                <div className="server-text-channels">

                </div>
            </div>
            <Chat socket={socket} />
            <div className="server-members">

            </div>
        </div>
    )
}

export default Server;
