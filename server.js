const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('flash');
const $ = require('jquery');
const passport = require('passport');
const socketIO = require('socket.io');
const {Users} = require('./helpers/UsersClass');


const container = require('./container');

container.resolve(function(users, _, admin, mainAdmin, home, room, profile){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chatapp');

    const app = SetupExpress();
    
    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(3333,function() {
            console.log('listening on port 3333');
        });
        ConfigrureExpress(app);

        require('./socket/roomchat')(io, Users);
        require('./socket/friend')(io);
       // require('./public/js/room/sendrequest')(io);



        //setup router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        mainAdmin.SetRouting(router);
        home.SetRouting(router);
        room.SetRouting(router);
        profile.SetRouting(router);
        

        app.use(router);
    }

    function ConfigrureExpress(app) {
        require('./passport/passport-local');
        require('./passport/passport-facebook');
        require('./passport/passport-google');
        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(validator());
        app.use(session({
            secret: 'thisissasecretkey',
            resave: true,
            saveInitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }))
        app.use(flash());
        app.use(passport.initialize());
        app.use(passport.session());
        app.locals._ = _;
        app.locals.stringSlice = (str,a,b) => {
            var stringgg = str.slice(a,b).trim();
            //console.log('crop string ::::::::::',stringgg);
            return stringgg;
        } 
    }

});