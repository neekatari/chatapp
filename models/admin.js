const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const adminSchema = mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String,  default: ''},
    userImage: {type: String, default: 'default.png'}
});

adminSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

adminSchema.methods.validUserPassword = function(password){
    return bcrypt.compareSync(password, this.password);
    
}

module.exports = mongoose.model('Admin', adminSchema);