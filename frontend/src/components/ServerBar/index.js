import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { getServers } from "../../store/server";
import IndividualServerButton from "../IndividualServerButton";
import "./index.css"



function ServerBar({ user }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getServers(user.id)).then(() => setIsLoaded(true))
    }, [dispatch]);
    const yourServers = useSelector(state => {
        return state.myServers.myServers
    })



    return (

        <div className="serverBar">
            <div className="home-button">
                <i className="fab fa-discord"></i>
            </div>
            {isLoaded &&
                <div className="your-servers">
                    {yourServers.map((ele, i) => (
                        <IndividualServerButton key={i} server={ele}/>
                    ))}
                </div>}

        </div>
    );
}


export default ServerBar;
