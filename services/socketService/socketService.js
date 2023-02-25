
let onlineUsers = []

function addOnlineUser(newUser) {
    let theUser = onlineUsers.find(user => user.userId === newUser.userId)
    console.log("find -->", theUser)
    if (!theUser) {
        console.log("before ", onlineUsers)
        onlineUsers.push(newUser)
        console.log("after ", onlineUsers)
        return onlineUsers
    }
    return onlineUsers
}

function removeOnlineUser(socketId) {
    let theUser = onlineUsers.filter(user => user.socketId !== socketId)
    onlineUsers = theUser;
    return onlineUsers
}
function removeOnlineUserWithUserId(userId) {
    let theUser = onlineUsers.filter(user => user.userId !== userId)
    onlineUsers = theUser;
    return onlineUsers
}


function getSocketIdOfAnUser(userId) {
    const theUser = onlineUsers.find(user => user?.userId === userId)
    let socketId = null;
    if (theUser) {
        socketId = theUser.socketId
    }
    return socketId

}
module.exports = { removeOnlineUser, addOnlineUser, removeOnlineUserWithUserId, getSocketIdOfAnUser, onlineUsers }