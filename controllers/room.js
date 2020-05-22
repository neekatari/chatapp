module.exports = function(async, Room, _, Users, Group){
    return {
        SetRouting: function(router){
            router.get('/room/:name', this.roomPage );
            router.post('/room/:name', this.groupPostPage);
        },

        roomPage: function(req, res){
            const name = req.params.name;
            var resultfriendreq = [];
            async.parallel([
                function(callback){
                    Room.find({'owner': req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                   
                },
                

                function(callback){
                    Users.findOne({'username': req.user.username})
                    .populate('request.userId')
                    .exec((err, result) => {
                        //console.log('result>>>>>>>>>>>>>>>>>>>>>>>>> ',result);
                        resultfriendreq=result;
                        callback(err, result);
                    })
               
                },

                function(callback){
                    Group.find({})
                         .populate('sender')
                         .exec((err, result) => {
                             callback(err, result);
                         })
                }
            ], (err, results , ress) => {
                const res1 = results[0];
                const res2 = results[2];
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',res1);
                // console.log('done bro::::::::::::::::::::::::::::::::::', resultfull);
                res.render('roomchat/room', {title: 'hashchat - Room', user: req.user, first: res1, data: resultfriendreq , roomName:name, groupMsg: res2});
        })},
        // roomPageNoti: function(req, res){
        //     const name = req.params.name;
        //     async.parallel([
        //         function(callback){
        //         Users.findOne({'username': req.user.username})
        //         .populate('request.userId')
        //         .exec((err, result) => {
        //             callback(err, result);
        //         })
           
        //     }
        //     ], (err, results) => {
        //         const res1 = results[0];
        //         console.log("rs: ",res1);
        //         console.log('username: ',req.user.username);
        //         res.render('roomchat/room', {title: 'hashchat - Room', user: req.user, first: req.room, roomName:name});// don't show the list of room in side nav
        // })},

        // function(callback){
        //     Users.findOne({'username': req.body.username})
        //     .populate('request.userId')
        //     .exec((err, result) => {
        //         callback(err, result);
        //     })
           
        // }

       

        groupPostPage: function(req, res){
            console.log(req.user);
            async.parallel([
                function(callback){
                    if(req.body.receiverName){
                     Users.update({
                            'username': req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendList.friendId': {$ne: req.user._id}
                        },
                        {
                            $push: {request: {
                                userId: req.user._id,
                                username: req.user.username
                            }},
                            $inc: {totalRequest: 1}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                },

                function(callback){
                    if(req.body.receiverName){
                        Users.update({
                            'username': req.user.username,
                            'sentRequest.username': {$ne: req.body.receiverName}
                        },
                        {
                            $push: {sentRequest: {
                                username: req.body.receiverName
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/room/'+req.params.name);
            });


            async.parallel([
                function(callback){
                    if(req.body.message){
                        const group = new Group();
                        group.sender = req.user._id;
                        group.body = req.body.message;
                        group.name = req.body.roomName;
                        group.createdAt = new Date();

                        group.save((err, msg) => {
                            console.log(msg);
                            callback(err, msg);
                        })
                    }
                }
            ], (err, results)=> {
                res.redirect('/group/'+req.params.name);
            });
            //console.log(req.user);  

            async.parallel([
                //this function is updated for the receiver of the friend request when it is accepted 
                function(callback){
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.user._id,
                            'friendList.friendId': {$ne: req.body.senderId}
                        },{
                            $push: {friendList: {
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                            $pull: {request: {
                                userId: req.body.senderId,
                                userName: req.body.senderName
                            }},
                            $inc: {totalRequest: -1}
                        },(err, count) => {
                            console.log("sender:  :: ", req.body.senderName);
                            callback(err, count);
                        });
                    }

                },
                //this function is updated for the sender of the friend request when it is accepted 

                function(callback){
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.body.senderId,
                            'friendList.friendId': {$ne: req.user._id}
                        },{
                            $push: {friendList: {
                                friendId: req.user._id,
                                friendName: req.user.username
                            }},
                            $pull: {sentRequest: {
                                userName: req.user.username
                            }},
                       
                        },(err, count) => {
                            callback(err, count);
                        });
                    }

                },

                function(callback){
                    if(req.body.user_Id){
                        Users.update({
                            '_id': req.user._id,
                            'request.userId': {$eq: req.body.user_Id}
                        },{
                            $pull: {request: {
                               userId: req.body.user_Id
                            }},
                            $inc: {totalRequest: -1}
                        },(err, count) => {
                            callback(err, count);
                        });
                    }

                },

                function(callback){
                    if(req.body.user_Id){
                        Users.update({
                            '_id': req.body.user_Id,
                            'sentRequest.username': {$eq: req.user.username}
                        },{
                            $pull: {sentRequest: {
                               username: req.user.username                            
                            }}
                            
                        },(err, count) => {
                            callback(err, count);
                        });
                    }

                }



            ], (err, results) =>{
                res.redirect('/room/'+req.params.name);
            });
        }

        }
    }

