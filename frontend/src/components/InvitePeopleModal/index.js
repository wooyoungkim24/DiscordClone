import { useState, useEffect } from 'react';
// import postsReducer from '../../store/posts';
// import "./index.css";
import { getMyFriends } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';




function InvitePeopleModal ({user}) {

    const dispatch = useDispatch();


    useEffect(() =>{
        dispatch(getMyFriends(user.id))
    }, [dispatch])

    return (
        <div className="invite-people-modal-container">
            Hi
        </div>
    )
}


export default InvitePeopleModal
