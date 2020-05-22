// const path = require('path');
// const fs = require('fs');

module.exports = function(formidable, Room, aws, Users , async) {
    console.log('aws', aws);
    return {
        SetRouting: function(router){
            router.get('/dashboard', this.adminPage);

           
            router.post('/uploadFile', ( req, res ) => {
                aws.ProfileImgUpload( req, res, ( error ) => {
                   
                res.json( {
                     Success: 'done'
                    } );
                   }
                  
                 );
                }, this.uploadFile);

            router.post('/home', this.adminPostPage);
        },

        adminPage: function(req, res){
            res.render('admin/dashboard');
        },

        adminPostPage: function(req, res){
            const newRoom = new Room();
            newRoom.name = req.body.room;
            newRoom.description = req.body.description;
            newRoom.image = req.body.upload;
            newRoom.owner = req.user._id;
            newRoom.save((err) => {
                if(!err){

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
                else{
                    console.log('error: ', err);
                }
            })
        },

        uploadFile: function(req, res) {
            const form = new formidable.IncomingForm();
            // form.uploadDir = path.join(__dirname,'../public/uploads');

            form.on('file', (field, file) => {
                // fs.rename(file.path, path.join(form.uploadDir, file.name), (err) => {
                //     if(err) throw err;
                //     console.log('file renamed successfully');
                // })
            });

            form.on('error', (err) => {
                console.log(err)
            });

            form.on('end', () => {
                console.log('file Upload is Successfully');
            });

            form.parse(req);
        }
    }
}