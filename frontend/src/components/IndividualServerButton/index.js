import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getServers } from "../../store/server";





function IndividualServerButton({ server }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const [showHover, setShowHover] = useState(false)

    const handleMouseEnter = (e) => {

        setShowHover(true)


    }
    const handleMouseLeave = (e) => {
        setShowHover(false)
    }

    return (
        <div className="single-server-container">
            <div className='single-your-server' >
                <img onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='single-server-image' src={server.serverImage}></img>
            </div>
            {showHover &&
                <div className='single-server-hover'>
                    <div className="single-server-name">
                        {server.serverName}
                    </div>
                </div>
            }
        </div>

    )
}


export default IndividualServerButton;
