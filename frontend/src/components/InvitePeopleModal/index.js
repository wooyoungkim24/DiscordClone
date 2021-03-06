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
    const pendingServerMembers = useSelector(state => {
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
            <div className='invite-people-modal-title'>
                Invite friends to {server.serverName}
            </div>
            {isLoaded &&
                <div className='invite-friends-div'>

                    {friends.map(ele => {
                        if (!serverMembers.includes(ele.id) && !pendingServerMembers.includes(ele.id)) {
                            return (
                                <div className='individual-invite-friend'>
                                    <div className='individual-invite-left'>
                                        <div className='individual-friend-modal-image'>
                                            <img onError={({ currentTarget }) => {
                                                // console.log("i am erroring", currentTarget)
                                                currentTarget.onerror = null;
                                                currentTarget.src = 'https://awik.io/wp-content/uploads/2018/12/broken-img.png';
                                            }} src={ele.profilePicture} alt="profile picture"></img>
                                        </div>
                                        <div className='individual-friend-modal-name'>
                                            {ele.username}
                                        </div>
                                    </div>

                                    <div className='individual-invite-right'>
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
