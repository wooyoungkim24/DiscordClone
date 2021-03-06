let c_users = [];
let online = [];

// joins the user to the specific chatroom
function join_User(id, username, room, picture) {

    const p_user = { id, username, room, picture };
    let indexOfOld = c_users.findIndex(ele => ele.username === username)

    let oldUser = c_users.find(ele => ele.username === username)
    let oldVoice;
    if (oldUser) {
        if (oldUser.voiceRoom) {
            oldVoice = oldUser.voiceRoom
        }
    }

    if (indexOfOld !== -1) {
        c_users.splice(indexOfOld, 1);
    }
    // c_users.push(p_user)
    c_users.push({ ...p_user, voiceRoom: oldVoice });
    // console.log("###1")
    console.log(c_users, "users");


    return p_user;
}

function join_User_Voice(username, voiceRoom) {
    let oldUser = c_users.find(ele => ele.username === username)
    let oldUserIndex = c_users.findIndex(ele => ele.username === username)

    let newUser = { ...oldUser, voiceRoom: voiceRoom }

    c_users.splice(oldUserIndex, 1, newUser)
    // console.log("###2")
    console.log(c_users, "users");
    return newUser
}

function leave_User_Voice(username) {
    let oldUser = c_users.find(ele => ele.username === username)
    let oldUserIndex = c_users.findIndex(ele => ele.username === username)
    let newUser = { ...oldUser, voiceRoom: undefined }
    c_users.splice(oldUserIndex, 1, newUser)
    // console.log("###3")
    console.log(c_users, "users");
    return oldUser
}

function user_online(id, username, userId) {
    online.push({
        id,
        username,
        userId
    })
    return online

}

function get_all_voice(room) {
    let inVoice = [];
    c_users.forEach(ele => {
        // console.log("$$$", ele, ele.voiceRoom)
        if (ele.voiceRoom == room) {
            if (ele.voiceRoom !== undefined) {
                inVoice.push(ele)
            }
        }
    })
    return inVoice
}
function get_my_voice_after(room) {
    let inVoice = [];
    c_users.forEach(ele => {
        // console.log("$$$otherlog", ele, ele.voiceRoom)

        if (ele.voiceRoom === undefined) {
            inVoice.push(ele)
        }

    })
    return inVoice
}


console.log("user out", c_users);

// Gets a particular user id to return the current user
function get_Current_User(id) {
    // console.log('these are the users', c_users, id)
    return c_users.find((p_user) => p_user.id === id);
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
    const index = c_users.findIndex((p_user) => p_user.id === id);
    const onlineIndex = online.findIndex((p_user) => p_user.id === id);
    // console.log("what are myu oline", online, onlineIndex, id)
    if (onlineIndex !== -1) {

        // return c_users.splice(index, 1)[0];
        return online.splice(onlineIndex, 1)[0].userId;
    }
}

module.exports = {
    join_User,
    get_Current_User,
    user_Disconnect,
    user_online,
    join_User_Voice,
    get_all_voice,
    leave_User_Voice,
    get_my_voice_after
};
