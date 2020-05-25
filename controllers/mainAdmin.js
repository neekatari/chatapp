module.exports = function(_, passport, async, Room, Users){
    return{
        SetRouting: function(router){
            router.get('/admin', this.mainAdmin);
            router.get('/mainAdmin/adminDash',this.dash);
            router.get('/deactivate/:id', this.deactivatePage);
            router.get('/activate/:id', this.activatePage);
            router.get('/deactivateRoom/:id', this.deactivateRoomPage);
            router.get('/activateRoom/:id', this.activateRoomPage);

            router.post('/admin', passport.authenticate('admin.login', {
                successRedirect: '/mainAdmin/adminDash',
                failureRedirect: '/admin',
                failureFlash: true
            }))
        },

        mainAdmin: function(req, res){
            
            return res.render('mainAdmin/admin');
        },

        dash: function(req, res){
            async.parallel([
                function(callback){
                    Room.find({})
                    .populate('owner')
                    .exec((err, result) => {
                        callback(err, result);
                    })
                   
                },
                function(callback){
                    Users.find({},(err, result) => {
                        callback(err, result);
                    })
                   
                }
            ], (err, results , ress) => {
                const res1 = results[0];
                const res2 = results[1];
               
                res.render('mainAdmin/adminDash', {title: 'hashchat - Admin', rooms: res1, users: res2});
        })
           
        },
        
        deactivatePage: function(req, res) {
            var userId = {"_id": req.params.id};
            var newvalue = {_id : req.params.id, status: "d" };
            Users.updateOne(userId, newvalue, function(err, res) {
                if (err) throw err;
                console.log(newvalue);
               
            });
            res.redirect('/mainAdmin/adminDash');
        },

        activatePage: function(req, res) {
            var userId = {"_id": req.params.id};
            var newvalue = {_id : req.params.id, status: "a" };
            Room.updateOne(userId, newvalue, function(err, res) {
                if (err) throw err;
                console.log(newvalue);
               
            });
            res.redirect('/mainAdmin/adminDash');

        },
        deactivateRoomPage: function(req, res) {
            var roomId = {_id: req.params.id};
            var newvalue = {_id : req.params.id, status: "d" };
            Room.updateOne(roomId, newvalue, function(err, res) {
                if (err) throw err;
                console.log(newvalue);
               
            });
            res.redirect('/mainAdmin/adminDash');
        },

        activateRoomPage: function(req, res) {
            var roomId = {_id: req.params.id};
            var newvalue = {_id : req.params.id, status: "a" };
            Users.updateOne(roomId, newvalue, function(err, res) {
                if (err) throw err;
                console.log(newvalue);
               
            });
            res.redirect('/mainAdmin/adminDash');

        }

        
       
    }
}