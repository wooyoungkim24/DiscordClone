
import { csrfFetch } from './csrf';


const SET_SERVERS = 'session/setServers'
const SET_TEXT = 'session/setText'
const SET_MESSAGES = 'session/setMessages'

const setServers = (servers) => {
    return {
        type: SET_SERVERS,
        payload: servers,
    };
};

export const setMessages = (payload) => {
    return {
        type: SET_MESSAGES,
        payload: payload
    }
}
const setTextChannels = (channels) => {
    return {
        type: SET_TEXT,
        payload: channels
    }
}

export const setInitialMessages = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/single/text/${id}`)
    const textChannelHistory = await res.json();
    dispatch(setMessages(textChannelHistory.messageHistory))
    return textChannelHistory
}


export const getTextChannels = (id) => async dispatch => {
    const res = await csrfFetch(`/api/servers/all/text/${id}`)
    const textChannelsData = await res.json();

    dispatch(setTextChannels(textChannelsData))
    return textChannelsData;
}

export const getServers = (id) => async dispatch => {
    const response = await csrfFetch(`/api/servers/all/${id}`);
    const data = await response.json();
    // console.log('thesea re my servers',data)
    const { members, moderators, admins } = data;
    const myServers = [];
    members.forEach(ele => {
        myServers.push(ele.Server)
    })
    moderators.forEach(ele => {
        myServers.push(ele.Server)
    })
    admins.forEach(ele => {
        myServers.push(ele.Server)
    })
    dispatch(setServers(myServers));
    return response;
};

export const addNewMember = (payload) => async dispatch => {
    
}

// export const setInitialMessages = (textId) => async dispatch => {
//     const res = await csrfFetch(`/api/single/text/${textId}`)
//     const channel = await res.json();

// }




const initialState = { myServers: [], textChannels: {}, messageHistory: [] };
const serverReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_SERVERS:
            // console.log('what are my servers', action.payload)
            return {
                ...state,
                myServers: [...action.payload]
            }
        case SET_TEXT:
            let placeholder = initialState.textChannels
            action.payload.forEach(ele => {
                if (!placeholder[ele.serverId]) {
                    placeholder[ele.serverId] = [ele]
                } else {
                    placeholder[ele.serverId] = [...placeholder[ele.serverId], ele]
                }
            })
            return {
                ...state,
                textChannels: placeholder

            }
        case SET_MESSAGES:
            const messageHistory  = action.payload
            // console.log('what does history look like', messageHistory, Array.isArray(messageHistory))
            // console.log('please tell me', textId)
            let temp = [...state.messageHistory]
            if(!messageHistory){
                return {
                    ...state,
                    messageHistory: temp
                }
            }
            // const temp = {...state.messageHistories}
            // let newObj = {
            //     username: username,
            //     message: messageHistory[messageHistory.length - 1]
            // }

            // if (!temp[parseInt(textId)]) {
            //     temp[textId] = [newObj]
            // }else{
            //     temp[textId] = [...temp[textId], newObj]
            // }

            return {
                ...state,
                messageHistory: [...messageHistory]
            }
        default:
            return state;
    }
};

export default serverReducer;
