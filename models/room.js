const mongoose = require('mongoose');

const roomNames = mongoose.Schema({
    name: {type: String, default:''},
    description: {type: String, default:''},
    image: {type: String, default: 'default.png'},
    owner: {type: mongoose.Schema.Types, ref: 'User'},
    status: {type: String, default: 'a'},
    members: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
    
});

module.exports = mongoose.model('room', roomNames);