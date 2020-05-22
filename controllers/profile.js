module.exports = function(async,  _, Users, Room, Group) {
    return {
        SetRouting: function(router) {
            router.get('/settings/profile', this.getProfilePage);
            router.get('/profile/:name', this.overviewPage);

        },

        getProfilePage: function(req, res) {

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
                    Users.findOne({'username': req.user.username})
                    .populate('friendList.friendId')
                    .exec((err, result) => {
                        console.log('result>>>>>>>>>>>>>>>>>>>>>>>>> ',result);
                        
                        callback(err, result);
                    })
               
                }
            ], (err, results , ress) => {
                const res1 = results[0];
                const res2 = results[2];
                console.log('ressssssssssssssssssssss>>>>>>>>>>>>>>>>>>>>>>>>> ',res2);
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',res1);
                // console.log('done bro::::::::::::::::::::::::::::::::::', resultfull);
                res.render('user/profile', {title: 'hashchat - Profile', user: req.user, first: res1, data: resultfriendreq, friends: res2});
        })
           
        },
        overviewPage: function(req, res) {
            var resultfriendreq = [];
            var paramuserid = 0;
            async.series([
                function(callback){
                    Room.find({'owner': req.user._id}, (err, result) => {
                        callback(err, result);
                    })
                   
                },
                

                function(callback){
                    Users.findOne({'username': req.params.name})
                    .populate('request.userId')
                    .exec((err, result) => {
                        //console.log('result>>>>>>>>>>>>>>>>>>>>>>>>> ',result);
                        resultfriendreq=result;
                        callback(err, result);
                    })
               
                },
                function(callback){
                    Users.findOne({'username':  req.params.name})
                    .populate('friendList.friendId')
                    .exec((err, result) => {
                        paramuserid = result._id;
                        console.log('result>>>>>>>>>>>>>>>>>>>>>>>>> ',paramuserid);
                        
                        callback(err, result);
                    })
               
                },
                function(callback){
                    Room.find({'owner': paramuserid}, (err, result) => {
                        callback(err, result);
                    })
                   
                }
            ], (err, results , ress) => {
                const res1 = results[0];
                const res2 = results[2];
                const res3 = results[3];
                console.log('ressssssssssssssssssssss>>>>>>>>>>>>>>>>>>>>>>>>> ',res3);
                // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',res1);
                // console.log('done bro::::::::::::::::::::::::::::::::::', resultfull);
                res.render('user/overview', {title: 'hashchat - Profile', user: req.user, first: res1, data: resultfriendreq, friends: res2, rooms: res3});
        })
        }
    }
}