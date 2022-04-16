import { useState, useEffect } from 'react';
// import postsReducer from '../../store/posts';
// import "./index.css";
import { getMyFriends } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import "./index.css"



function InvitePeopleModal ({user,server}) {
    const [isLoaded, setIsLoaded] = useState(true)
    const dispatch = useDispatch();

    const friends = useSelector(state=>{
        return state.session.friends
    })

    useEffect(() =>{
        dispatch(getMyFriends(user.id))
        .then(() => setIsLoaded(true))
    }, [dispatch])

    return (
        <div className="invite-people-modal-container">
            <div>
                Invite friends to {server.serverName}
            </div>
            {isLoaded &&
                <div className='invite-friends-div'>
                    {friends.map(ele =>{
                        return (
                            <div className='individual-invite-friend'>
                                <div className='individual-friend-modal-image'>
                                    <img src={ele.profilePicture}></img>
                                </div>
                                <div className='individual-friend-modal-name'>
                                    {ele.username}
                                </div>
                                <div>
                                    <button type='button'>
                                        Invite
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            }

        </div>
    )
}


export default InvitePeopleModal
