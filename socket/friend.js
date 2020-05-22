module.exports = function(io){
    //debugger
    io.on('connection', (socket) => {
        socket.on('joinRequest', (myRequest, callback) => {
            console.log('myRequest', myRequest);
            socket.join(myRequest.sender);

            callback();
        });

        socket.on('friendRequest', (friend, callback) => {
           // debugger
            io.to(friend.receiver).emit('newFriendRequest', {
                from: friend.sender,
                to: friend.receiver
            });
            console.log(friend);
            callback();
        });
    }); 
}