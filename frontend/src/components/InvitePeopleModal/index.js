import { useState, useEffect } from 'react';
// import postsReducer from '../../store/posts';
// import "./index.css";
import { getMyFriends } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import "./index.css"
import { newServerInvite, getPendingServers, getAllServerMembers, getAllServerMembersPending } from '../../store/server';




function InvitePeopleModal({ user, server }) {
    const [isLoaded, setIsLoaded] = useState(true)
    const dispatch = useDispatch();

    const friends = useSelector(state => {
        return state.session.friends
    })
    const serverMembers = useSelector(state => {
        return state.myServers.serverMembers
    })
    const pendingServerMembers = useSelector(state =>{
        return state.myServers.pendingServerMembers
    })

    useEffect(() => {
        dispatch(getMyFriends(user.id))
            .then(() => dispatch(getAllServerMembers(server.id)))
            .then(() => dispatch(getAllServerMembersPending(server.id)))
            .then(() => setIsLoaded(true))
    }, [dispatch])

    const handleInvitePeople = (id) => {
        const payload = {
            userId: id,
            inviterId: user.id,
            serverId: server.id,
            pending: true
        }
        dispatch(newServerInvite(payload))
            .then(() => dispatch(getPendingServers(user.id)))
            .then(() => dispatch(getAllServerMembers(server.id)))
            .then(() => dispatch(getAllServerMembersPending(server.id)))
    }

    return (
        <div className="invite-people-modal-container">
            <div>
                Invite friends to {server.serverName}
            </div>
            {isLoaded &&
                <div className='invite-friends-div'>

                    {friends.map(ele => {
                        if (!serverMembers.includes(ele.id) && !pendingServerMembers.includes(ele.id)) {
                            return (
                                <div className='individual-invite-friend'>
                                    <div className='individual-friend-modal-image'>
                                        <img src={ele.profilePicture}></img>
                                    </div>
                                    <div className='individual-friend-modal-name'>
                                        {ele.username}
                                    </div>
                                    <div>
                                        <button type='button' onClick={() => handleInvitePeople(ele.id)}>
                                            Invite
                                        </button>
                                    </div>
                                </div>
                            )
                        }

                    })}
                </div>
            }

        </div>
    )
}


export default InvitePeopleModal
