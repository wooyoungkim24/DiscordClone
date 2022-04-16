
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, useHistory } from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";
import { getMyFriends, getDMs, createDM } from "../../store/session";


function Home({ user }) {
    console.log('why is there no user', user)

    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showNewDm, setShowNewDm] = useState(false)

    const [dmIds, setdmIds] = useState([])
    const friends = useSelector(state => {
        return state.session.friends
    })
    const dms = useSelector(state => {
        return state.session.myMessages
    })
    useEffect(() => {
        dispatch(getMyFriends(user.id))
            .then(() => dispatch(getDMs(user.id)))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const handleNewDm = () => {
        setShowNewDm(true)
    }

    const selectFriend = (e) => {
        const id = parseInt(e.target.value)
        if (dmIds.includes(id)) {
            return
        } else {
            const newIds = [...dmIds]
            newIds.push(id)
            setdmIds(newIds)
        }
    }


    const handleCreateNewDm = () =>{
        const payload = {
            userId: user.id,
            friendId: dmIds[0]
        }
        dispatch(createDM(payload))
        setShowNewDm(false)
    }

    return (
        <div className="home-container">
            <div className="home-nav">

            </div>

            <div className="home-friends">
                <div className="new-dm-button">
                    DIRECT MESSAGES
                    <button type="button" onClick={handleNewDm}>
                        <i class="fas fa-plus"></i>
                    </button>
                    {showNewDm &&
                        <div className="new-dm-popout">
                            <div className="new-dm-popout-title">
                                Select Friend
                            </div>
                            <div className="new-dm-popout-friends">
                                {friends.map(ele => {
                                    return (
                                        <div>
                                            <div className="new-dm-popout-friends-name">
                                                {ele.username}
                                            </div>
                                            <input
                                                type="checkbox"
                                                value={ele.id}
                                                onChange={selectFriend}
                                                checked={dmIds.includes(ele.id) ? true : false}
                                            >
                                            </input>
                                        </div>
                                    )
                                })}
                            </div>
                            <button type="button" onClick={handleCreateNewDm}>
                                Create DM
                            </button>
                        </div>
                    }
                </div>
                <div className="active-dms">
                    {dms.map(ele =>{
                        return (
                            <div>
                                {ele.username}
                            </div>
                        )
                    })}
                </div>

            </div>
            <Switch>
                <Route exact path="/servers/me/:id">

                </Route>
            </Switch>
        </div>
    )
}


export default Home
