

import { csrfFetch } from './csrf';


const SET_SERVERS = 'session/setServers'
const SET_TEXT = 'session/setText'

const setServers = (servers) => {
    return {
        type: SET_SERVERS,
        payload: servers,
    };
};
const setTextChannels = (channels) =>{
    return {
        type: SET_TEXT,
        payload:channels
    }
}


export const getTextChannels = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/all/text/${id}`)
    const textChannelsData = await res.json();

    dispatch(setTextChannels(textChannelsData))
    return textChannelsData;
}

export const getServers = (id) => async dispatch => {
    const response = await csrfFetch(`/api/servers/all/${id}`);
    const data = await response.json();
    // console.log('thesea re my servers',data)
    const {members, moderators, admins} = data;
    const myServers = [];
    members.forEach(ele =>{
        myServers.push(ele.Server)
    })
    moderators.forEach(ele =>{
        myServers.push(ele.Server)
    })
    admins.forEach(ele =>{
        myServers.push(ele.Server)
    })
    dispatch(setServers(myServers));
    return response;
};




const initialState = { myServers:[], textChannels:{}};
const serverReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_SERVERS:
            // console.log('what are my servers', action.payload)
            return {
                ...state,
                myServers:[...action.payload]
            }
        case SET_TEXT:
            let placeholder = initialState.textChannels
            action.payload.forEach(ele =>{
                if(!placeholder[ele.serverId]){
                    placeholder[ele.serverId] = [ele]
                }else{
                    placeholder[ele.serverId] = [...placeholder[ele.serverId], ele]
                }
            })
            return {
                ...state,
                textChannels:placeholder

            }
        default:
            return state;
    }
};

export default serverReducer;
