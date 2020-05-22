module.exports = function {
    return {
        SetRouting: function(router){
            router.get('/dashboard', this.adminPage);
        },

        adminPage: function(req, res){
            res.render('admin/dashboard');
        }
    }
}