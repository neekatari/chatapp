module.exports = function(async, Room, _, Users) {
    return {
        SetRouting: function(router){
            router.get('/home', this.homePage);

            router.get('/search', function(req, res){ 

                async.parallel([
                    function(callback){
                        Room.find({'owner': req.user._id}, (err, result) => {
                            callback(err, result);
                        })
                    },
                    function(callback){
                        Room.find({}, (err, result) => {
                            callback(err, result);
                        })
                    }
    
                ], (err, results) => {
                    const res1 = results[0];
                    const res2 = results[1];
                    //console.log(res1);
                    //res.render('home', {title: '', data: res1});
    
    
                    const dataChunk = [];
                    const chunkSize = 4;
    
                    for( let i = 0; i<res1.length; i += chunkSize){
                        dataChunk.push(res1.slice(i , i+chunkSize));
                    }
                    
                    console.log(dataChunk);
                    res.render('search', {title: '', user:req.user, chunks: dataChunk , first: res1, data: res2});
                })
            });
        },

        homePage: function(req, res){
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
               
                }

            ], (err, results) => {
                const res1 = results[0];
                const res2 = results[1];
                //console.log(res1);
                //res.render('home', {title: '', data: res1});


                const dataChunk = [];
                const chunkSize = 4;

                for( let i = 0; i<res1.length; i += chunkSize){
                    dataChunk.push(res1.slice(i , i+chunkSize));
                }
                
                console.log(dataChunk);
                res.render('home', {title: '', user:req.user, chunks: dataChunk , first: res1, data: res2});
            })
            
        }
    }
}