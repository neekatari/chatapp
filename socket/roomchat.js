module.exports = function(io, Users) {
    //debugger;
    const users = new Users();

    io.on('connection', (socket) => {
        console.log('User Connected');
        
    

        socket.on('join', (params, callback) => {
            socket.join(params.room);
            
            users.AddUserData(socket.id, params.name, params.room);
            //console.log(users);
            io.to(params.room).emit('userList', users.GetUserList(params.room));

            callback();
        });

        socket.on('createMessage', (message, callback) => {
            console.log(message);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
                from: message.sender
            });

            callback();
        });

        socket.on('disconnect', () => {
            var user = users.RemoveUser(socket.id);

            if(user){
                io.to(user.room).emit('userList', users.GetUserList(user.room));
            }
        })

    });
}