module.exports = function(_, passport){
    return{
        SetRouting: function(router){
            router.get('/admin', this.mainAdmin);
            router.get('/mainAdmin/adminDash',this.dash);

            router.post('/admin', passport.authenticate('admin.login', {
                successRedirect: '/mainAdmin/adminDash',
                failureRedirect: '/jaba',
                failureFlash: true
            }))
        },

        mainAdmin: function(req, res){
            return res.render('mainAdmin/admin');
        },

        dash: function(res, res){
            return res.render('mainAdmin/adminDash');
        }

        
       
    }
}