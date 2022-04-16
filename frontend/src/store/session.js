import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';
const SET_FRIENDS = 'session/setFriends'
const SET_MY_MESSAGES= 'session/setMyMessages'

const setMyMessages = (messages) =>{
    return {
        type: SET_MY_MESSAGES,
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
const removeUser = () => {
    return {
        type: REMOVE_USER,
    };
};

export const getDMs = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/active/messages/${id}`)
    const data= await res.json()
    dispatch(setMyMessages(data))
    return data
}

export const getMyFriends = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/users/friends/${id}`)
    const data = await res.json();
    // console.log('these are my friends',data)
    dispatch(setFriends(data))
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
    const { username, email, password } = user;
    const response = await csrfFetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
            username,
            email,
            password,
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
const initialState = { user: null, friends:[] , myMessages:[]};

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
        case SET_FRIENDS:
            return {
                ...state,
                friends:[...action.payload]
            }
        case SET_MY_MESSAGES:
            return {
                ...state,
                myMessages:[...action.payload]
            }
        default:
            return state;
    }
};

export default sessionReducer;
