
import { csrfFetch } from './csrf';


const SET_SERVERS = 'session/setServers'
const SET_TEXT = 'session/setText'
const SET_NEW_SERVER = 'session/setNewServer'
const SET_MESSAGES = 'session/setMessages'
const SET_PENDING_SERVERS = 'session/setPendingServers'
const CLEAR_PENDING_SERVER = 'session/clearPendingServer'
const SET_ALL_SERVER_MEMBERS= 'session/setAllServerMembers'
const CLEAR_PENDING_ADD_SERVER = 'session/clearPendingAddServer'
const SET_ALL_SERVER_MEMBERS_PENDING= 'session/setAllServerMembersPending'
const REMOVE_SERVER = 'session/removeServer'
const SET_ALL_NOT_ADMIN_MEMBERS = 'session/setAllNotAdminMembers'
const REMOVE_NOT_ADMIN_MEMBER = 'session/kickMember'
const SET_MY_TEXT = 'session/setMyText'
const SET_MEMBERS_AND_ADMINS = 'session/setMembersAndAdmins'
const SET_VOICE_CHANNELS = 'session/setVoiceChannels'


const setServers = (servers) => {
    return {
        type: SET_SERVERS,
        payload: servers,
    };
};
const clearPendingServer = (id) =>{
    return{
        type: CLEAR_PENDING_SERVER,
        payload: id
    }
}

const clearPendingAddServer = (data) =>{
    return{
        type: CLEAR_PENDING_ADD_SERVER,
        payload: data
    }
}
const setPendingServers = (servers) =>{
    return {
        type: SET_PENDING_SERVERS,
        payload: servers
    }
}

const removeServer = (server) => {
    return {
        type: REMOVE_SERVER,
        payload: server
    }
}
const removeNotAdminMember = (server) =>{
    return {
        type: REMOVE_NOT_ADMIN_MEMBER,
        payload: server
    }
}
const setNewServer =(server) =>{
    return{
        type: SET_NEW_SERVER,
        payload: server
    }
}

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

const setMyTextChannels = (channels)=>{
    return {
        type: SET_MY_TEXT,
        payload: channels
    }
}

const setAllServerMembers = (members) =>{
    return {
        type:SET_ALL_SERVER_MEMBERS,
        payload:members
    }
}
const setAllServerMembersPending= (members) =>{
    return {
        type:SET_ALL_SERVER_MEMBERS_PENDING,
        payload:members
    }
}
const setAllNotAdminMembers = (members) =>{
    return {
        type: SET_ALL_NOT_ADMIN_MEMBERS,
        payload: members
    }
}
const setMembersAndAdmins = (people) =>{
    return {
        type: SET_MEMBERS_AND_ADMINS,
        payload: people
    }
}

const setVoiceChannels = (channels) =>{
    return {
        type: SET_VOICE_CHANNELS,
        payload: channels
    }
}


export const getMembersAndAdmins = (serverId) => async dispatch =>{

    const res = await csrfFetch(`/api/servers/all/members/only/${serverId}`)
    const members = await res.json();
    const res2 = await csrfFetch(`/api/servers/all/admins/${serverId}`)
    const admin = await res2.json()
    const payload = {
        members:members,
        admin:admin
    }
    dispatch(setMembersAndAdmins(payload))
}

export const getAllServerMembers = (serverId) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/all/members/${serverId}`)
    const data= await res.json();
    dispatch(setAllServerMembers(data))
    return data
}
export const getAllServerMembersPending = (serverId) => async dispatch => {
    console.log("is it here")
    const res = await csrfFetch(`/api/servers/all/pending/members/${serverId}`)
    const data= await res.json();
    dispatch(setAllServerMembersPending(data))
    return data
}

export const getAllNotAdminMembers = (serverId) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/all/members/notAdmin/${serverId}`)
    const data= await res.json()

    dispatch(setAllNotAdminMembers(data))
    return data

}
export const newServerInvite = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/servers/new/member",{
        method: "POST",
        body:JSON.stringify(payload)
    })
    const data = await res.json();
    return data
}

export const acceptInvite = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/edit/member`, {
        method:"PUT",
        body: JSON.stringify({id})
    })
    const data = await res.json()
    dispatch(clearPendingAddServer(data))
    return data
}

export const rejectInvite =(id) => async dispatch =>{
    const res = await csrfFetch (`/api/servers/delete/member`, {
        method: "DELETE",
        body: JSON.stringify({id})
    })
    const data = await res.json()
    dispatch(clearPendingServer(data.id))
    return data
}


export const createNewServer = (payload) => async dispatch =>{
    const res = await csrfFetch(`/api/servers`, {
        method: "POST",
        body: JSON.stringify(payload)
    })
    const data = await res.json();
    dispatch(setNewServer(data))
    return data
}

export const editServer = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/servers", {
        method:"PUT",
        body:JSON.stringify(payload)
    })
    const data = await res.json();
    return data
}

export const leaveServer = (payload) => async dispatch =>{

    const res = await csrfFetch("/api/servers/delete/member/leave", {
        method: "DELETE",
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(removeServer(data.Server))
}
export const kickServer = (payload) => async dispatch =>{

    const res = await csrfFetch("/api/servers/delete/member/leave", {
        method: "DELETE",
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(removeNotAdminMember(data))
}
export const setInitialMessages = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/single/text/${id}`)
    const textChannelHistory = await res.json();
    dispatch(setMessages(textChannelHistory.messageHistory))
    return textChannelHistory
}

export const getPendingServers = (id) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/all/pending/${id}`)
    const data = await res.json();
    console.log("what is my datanow", data)
    dispatch(setPendingServers(data))
    return data
}


export const getTextChannels = (id) => async dispatch => {
    const res = await csrfFetch(`/api/servers/all/text/${id}`)
    const textChannelsData = await res.json();

    dispatch(setTextChannels(textChannelsData))
    return textChannelsData;
}

export const getTextChannel = (id) => async dispatch => {
    const res = await csrfFetch(`/api/servers/all/text/${id}`)
    const textChannelsData = await res.json();

    dispatch(setMyTextChannels(textChannelsData))
    return textChannelsData;
}

export const editTextChannel = (payload)=> async dispatch =>{
    console.log('whats my payload', payload)
    const res = await csrfFetch(`/api/servers/text`, {
        method: "PUT",
        body: JSON.stringify(payload)
    })
    const data = await res.json();
    dispatch(setMyTextChannels(data))
    return data
}

export const createNewText = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/servers/text", {
        method: "POST",
        body: JSON.stringify(payload)
    })
    const data = await res.json()
    dispatch(setMyTextChannels(data))
    return data
}

export const deleteTextChannel = (payload) => async dispatch =>{
    const res = await csrfFetch("/api/servers/text", {
        method: "DELETE",
        body:JSON.stringify(payload)
    })
    const data= await res.json();
    dispatch(setMyTextChannels(data))
    return data
}

export const getAllVoiceChannels = (serverId) => async dispatch =>{
    const res = await csrfFetch(`/api/servers/all/voice/${serverId}`)
    const data = await res.json()
    dispatch(setVoiceChannels(data))
    return data
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
    return myServers;
};

// export const addNewMember = (payload) => async dispatch => {

// }

// export const setInitialMessages = (textId) => async dispatch => {
//     const res = await csrfFetch(`/api/single/text/${textId}`)
//     const channel = await res.json();

// }

export const deleteServer = (id) => async dispatch =>{
    const res = await csrfFetch("/api/servers", {
        method: "DELETE",
        body:JSON.stringify({id})
    })
    const data = await res.json();
    dispatch(removeServer(data))
}




const initialState = {voiceChannels: [],membersAndAdmins: {}, myTextChannels:[],nonAdminServerMembers:[],serverMembers:[],pendingServerMembers:[], myServers: [], textChannels: {}, messageHistory: [], pendingServers:[] };
const serverReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_SERVERS:
            // console.log('what are my servers', action.payload)
            return {
                ...state,
                myServers: [...action.payload]
            }
        case SET_MEMBERS_AND_ADMINS:
            let MA = {}
            MA["members"] = action.payload.members
            MA["admin"] = action.payload.admin
            return {
                ...state,
                membersAndAdmins:MA
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
        case SET_MY_TEXT:
            console.log('what is the action', action.payload)
            return {
                ...state,
                myTextChannels:[...action.payload]
            }


        case SET_VOICE_CHANNELS:
            return {
                ...state,
                voiceChannels:[...action.payload]
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
        case SET_ALL_SERVER_MEMBERS:
            let z = [];
            action.payload.forEach(ele =>{
                z.push(ele.userId)
            })
            return {
                ...state,
                serverMembers:z
            }
        case SET_ALL_SERVER_MEMBERS_PENDING:
            let a= [];
            action.payload.forEach(ele =>{
                a.push(ele.userId)
            })
            return {
                ...state,
                pendingServerMembers:a
            }
        case SET_ALL_NOT_ADMIN_MEMBERS:
            return{
                ...state,
                nonAdminServerMembers:[...action.payload]
            }
        case SET_NEW_SERVER:
            let x = [...state.myServers, action.payload];

            return {
                ...state,
                myServers: x
            }
        case SET_PENDING_SERVERS:
            let y = []
            action.payload.forEach(ele =>{
                y.push({
                    id:ele.id,
                    inviter:ele.sender,
                    receivor: ele.receivor,
                    server: ele.Server
                })
            })
            return {
                ...state,
                pendingServers:y
            }
        case CLEAR_PENDING_ADD_SERVER:
            let newServers = [...state.myServers, action.payload.Server]
            let pendingServersPre = [...state.pendingServers]
            let i = pendingServersPre.findIndex(ele => parseInt(ele.id) === parseInt(action.payload.id))
            pendingServersPre.splice(i,1)
            return{
                ...state,
                myServers:[...newServers],
                pendingServers:[...pendingServersPre]
            }

        case CLEAR_PENDING_SERVER:
            let servers = [...state.pendingServers]
            let spliceIndex = servers.findIndex(ele => parseInt(ele.id) === parseInt(action.payload))
            servers.splice(spliceIndex,1)
            return {
                ...state,
                pendingServers: [...servers]
            }
        case REMOVE_SERVER:
            let currentServers = [...state.myServers]

            let serverIndex = currentServers.findIndex(ele => parseInt(ele.id) === parseInt(action.payload.id))
            currentServers.splice(serverIndex, 1)
            return {
                ...state,
                myServers: currentServers
            }
        case REMOVE_NOT_ADMIN_MEMBER:
            let currentNotAdmin = [...state.nonAdminServerMembers]
            let nonAdminIndex = currentNotAdmin.findIndex(ele => parseInt(ele.id) === parseInt(action.payload.id))
            currentNotAdmin.splice(nonAdminIndex, 1)
            return {
                ...state,
                nonAdminServerMembers:currentNotAdmin
            }
        default:
            return state;
    }
};

export default serverReducer;
