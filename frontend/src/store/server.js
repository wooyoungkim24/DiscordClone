
import { csrfFetch } from './csrf';


const SET_SERVERS = 'session/setServers'

const setServers = (servers) => {
    return {
        type: SET_SERVERS,
        payload: servers,
    };
};

export const getServers = (id) => async dispatch => {
    const response = await csrfFetch(`/api/servers/all/${id}`);
    const data = await response.json();
    console.log('thesea re my servers',data)
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




const initialState = { myServers:[]};
const serverReducer = (state = initialState, action) => {

    switch (action.type) {
        case SET_SERVERS:
            console.log('what are my servers', action.payload)
            return {
                ...state,
                myServers:[...action.payload]
            }
        default:
            return state;
    }
};

export default serverReducer;
