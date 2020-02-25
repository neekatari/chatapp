
module.exports = function(_, passport){

    return{
        SetRouting: function(router){
            router.get('/',this.indexPage);
            
            router.get('/signup', this.getSignUp);
            router.get('/home', this.homePage);
            router.get('/login', this.loginPage);
            router.get('/auth/facebook', this.getFacebookLogin);
            router.get('/auth/facebook/callback', 
                passport.authenticate('facebook', {
                    successRedirect: '/home',
                    failureRedirect: '/',
                    failureFlash: true
                }));

            router.get('/auth/google', this.getGoogleLogin);
            router.get('/auth/google/callback',  
                passport.authenticate('google', {
                    successRedirect: '/home',
                    failureRedirect: '/',
                    failureFlash: true
                }));

            router.post('/signup', passport.authenticate('local.signup', {
                successRedirect: '/home',
                failureRedirect: '/signup',
                failureFlash: true
            }));

            router.post('/login', passport.authenticate('local.login', {
                successRedirect: '/home',
                failureRedirect: '/login',
                failureFlash: true
            }));
    
        },
        
        indexPage: function(req, res){
            return res.render('index');
        },

        getSignUp: function(req, res){
          
            return res.render('signup');
        },

        loginPage: function(req, res){
            return res.render('login');
        },

        getFacebookLogin: passport.authenticate('facebook',{
            scope: 'email'
        }),

        getGoogleLogin: passport.authenticate('google', {
            scope: ['https://www.googleapis.com/auth/plus.login',
            'https://www.googleapis.com/auth/plus.profile.emails.read'] 
        }),

        

        // postSignUp: passport.authenticate('local.signup', {
        //     successRedirect: '/home',
        //     failureRedirect: '/signup',
        //     failureFlash: true
        // }),
        

       
        homePage: function(req, res){
            return res.render('home');
        }



    }

}