import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_FRIENDS = 'session/setFriends'
const SET_MY_MESSAGES= 'session/setMyMessages'
const SET_MY_DMS = 'session/setMyDMs'
const SET_PENDING_FRIENDS = 'session/setPendingFriends'
const SET_NOT_FRIENDS = 'session/setNotFriends'
const SET_PENDING_SENT_FRIENDS = 'session/setPendingSentFriends'
const SET_INITIAL_PENDING_SENT_FRIENDS = 'session/setInitialPendingSentFriends'
const USER_ONLINE = 'session/userOnline'

const userOnline = (user)=>{
    return {
        type: USER_ONLINE,
        payload:user
    }
}

const setMyMessages = (messages) =>{
    return {
        type: SET_MY_MESSAGES,
        payload: messages
    }
}
// export const setInitialActiveDms = (messages) =>{
//     return {
//         type: SET_MY_MESSAGES,

//     }
// }
export const setInitialPendingSentFriends = (pending) =>{
    return{
        type: SET_INITIAL_PENDING_SENT_FRIENDS,
        payload:pending
    }
}

const setPendingSentFriends = (friend) =>{
    return {
        type: SET_PENDING_SENT_FRIENDS,
        payload: friend
    }
}

const setPendingFriends = (friends) =>{
    return {
        type: SET_PENDING_FRIENDS,
        payload:friends
    }
}

export const setDMs = (messages) =>{
    return {
        type: SET_MY_DMS,
        payload: messages
    }
}
const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user,
    };
};
const setFriends = (friends) =>{
    return {
        type: SET_FRIENDS,
        payload: friends
    }
}

const setNotFriends= (notFriends) =>{
    return {
        type:SET_NOT_FRIENDS,
        payload:notFriends
    }
}
const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};


export const userNowOnline = (id) => async dispatch =>{
    // console.log("is it here breaking")
    const res = await csrfFetch(`/api/users/user/online`, {
        method:"PUT",
        body:JSON.stringify({id})
    })
    let data = await res.json()
    dispatch(userOnline(data))
    return data
}

export const getDMsTemp =(id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/get/dms/temp/${id}`)
    const data = await res.json()
    return data
}

export const getDMs = (id) => async dispatch =>{

    const res = await csrfFetch(`/api/users/active/messages/${id}`)
    const data= await res.json()
    dispatch(setMyMessages(data))

    return data
}

export const setInitialDMs = (payload) => async dispatch =>{
    const {userId, id} = payload
    const res = await csrfFetch(`/api/users/single/dm/${userId}/${id}`)
    const data = await res.json();
    // console.log("is this wrong data", data)
    dispatch(setDMs(data.messageHistory))
    return data
}

export const deleteDM = (payload) => async dispatch =>{

    const res = await csrfFetch("/api/users/delete/dm",{
        method:"DELETE",
        body:JSON.stringify(payload)
    })
    const data = await res.json();
    dispatch(setMyMessages(data))
    return data
}

export const getOtherPerson = (id) => async dispatchEvent =>{
    const res = await csrfFetch(`/api/users/other/person/${id}`)
    const data = await res.json()
    return data
}

export const createDM = (payload) => async dispatch =>{

    const res = await csrfFetch(`/api/users/create/dm`,{
        method: "POST",
        body: JSON.stringify(payload)
    })
    const newDM = await res.json();
    dispatch(setMyMessages(newDM))
    return newDM
}

export const getMyFriends = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/friends/${id}`)
    const data = await res.json();
    // console.log('these are my friends',data)
    dispatch(setFriends(data))
    return data
}

export const getPendingFriends = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/pending/friends/${id}`)
    const data = await res.json()
    dispatch(setPendingFriends(data))
    return data
}

export const getInitialPendingSentFriends = (userId) => async dispatch =>{
    // console.log("is it break here", userId)
    const res = await csrfFetch(`/api/users/all/pending/sent/${userId}`)
    const data = await res.json()

    dispatch(setInitialPendingSentFriends(data))
    return data
}


export const getNotFriends = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/not/friends/${id}`)
    const data =await res.json()
    dispatch(setNotFriends(data))
    return data
}

export const acceptFriend = (payload) => async dispatch =>{

    const res = await csrfFetch("/api/users/accept/friend", {
        method: "PUT",
        body:JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(setPendingFriends(data))

    return data
}

export const rejectFriend = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/users/delete/friend", {
        method:"DELETE",
        body:JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(setPendingFriends(data))
    return data
}

export const removeFriend = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/users/remove/friend",{
        method:"DELETE",
        body:JSON.stringify(payload)
    })
    const data = await res.json();
    return data
}


export const sendAddFriend = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/users/new/friend",{
        method:"POST",
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(setPendingSentFriends(data))
    return data
}


export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({
            credential,
            password,
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return data.user;
};

export const signup = (user) => async (dispatch) => {
    const { username, email, password, profilePicture } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            email,
            password,
            profilePicture
        }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };
const initialState = {pendingSentFriends:[],notFriends:[], pendingFriends:[], user: null, friends:[] , myMessages:[], mySingleDMs:[]};

const sessionReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {

        case SET_USER:
            newState = Object.assign({}, state);
            newState.user = action.payload;
            return newState;
        case REMOVE_USER:

            newState = Object.assign({}, state);
            newState.user = null;
            return newState;

        case USER_ONLINE:
            return {
                ...state,
                user:{...action.payload}
            }
        case SET_FRIENDS:
            // let b = [];
            // action.payload.forEach(ele =>{

            // })
            return {
                ...state,
                friends:[...action.payload]
            }


        case SET_PENDING_SENT_FRIENDS:

            let newSent = [...state.pendingSentFriends, action.payload]
            return {
                ...state,
                pendingSentFriends: newSent
            }

        case SET_INITIAL_PENDING_SENT_FRIENDS:

            return {
                ...state,
                pendingSentFriends:[...action.payload]
            }
        case SET_PENDING_FRIENDS:

            return{
                ...state,
                pendingFriends:[...action.payload]
            }
        case SET_NOT_FRIENDS:
            return{
                ...state,
                notFriends:[...action.payload]
            }
        case SET_MY_MESSAGES:
            // console.log('what are my messages', action.payload)

            return {
                ...state,
                myMessages:[...action.payload]
            }
        case SET_MY_DMS:

            return {
                ...state,
                mySingleDMs:[...action.payload]
            }
        default:
            return state;
    }
};

export default sessionReducer;
