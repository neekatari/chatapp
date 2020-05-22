const mongoose = require('mongoose');

const roomNames = mongoose.Schema({
    name: {type: String, default:''},
    description: {type: String, default:''},
    image: {type: String, default: 'default.png'},
    owner: {type: String, default: ''},
    members: [{
        username: {type: String, default: ''},
        email: {type: String, default: ''}
    }]
    
});

module.exports = mongoose.model('room', roomNames);