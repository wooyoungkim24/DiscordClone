
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { getServers, getTextChannels } from "../../store/server";
import { getMyFriends, getDMs, createDM } from "../../store/session";
import DirectMessage from "../DirectMessage";


function Home({ user }) {

    let {path, url} = useRouteMatch()

    const history = useHistory()
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [showNewDm, setShowNewDm] = useState(false)

    const [dmId, setdmId] = useState("")
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
        if (dmId === id) {
            return
        } else {
            setdmId(id)
        }
    }


    const handleCreateNewDm = () => {
        const payload = {
            userId: user.id,
            friendId: dmId
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
                            <i className="fas fa-plus"></i>
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
                                                    type="radio"
                                                    value={ele.id}
                                                    onChange={selectFriend}
                                                    checked={dmId === ele.id ? true : false}
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
                        {dms.map(ele => {
                            return (
                                <div key={ele.id} onClick={() => history.push(`/home/${ele.id}`)} className="list-element-active-dm">
                                    {ele.username}
                                </div>
                            )
                        })}
                    </div>

                </div>

                <Switch>
                    <Route exact path={`/home/:id`}>
                        {console.log('whywhwywhywhwywwhy')}
                        <DirectMessage user={user} />
                    </Route>

                </Switch>




            </div>



    )
}


export default Home
