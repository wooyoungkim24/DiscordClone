
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch , useHistory} from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";
import { getMyFriends, getDMs } from "../../store/session";


function Home ({user}) {
    console.log('why is there no user', user)

    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const friends = useSelector(state=>{
        return state.session.friends
    })
    const dms = useSelector(state=>{
        return state.session.myMessages
    })
    useEffect(() =>{
        dispatch(getMyFriends(user.id))
        .then(() => dispatch(getDMs(user.id)))
        .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <div className="home-container">
            <div className="home-nav">

            </div>

            <div className="home-friends">

            </div>
            {/* <Switch>
                <Route exact path="/servers/me/:id">

                </Route>
            </Switch> */}
        </div>
    )
}


export default Home
