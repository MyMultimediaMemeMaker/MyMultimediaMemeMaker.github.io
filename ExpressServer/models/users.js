const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: false
    },
    Password:{
        type: String,
        required: true
    },
    IsUser:{
        type: Boolean,
        required: true
    },
    IsAdmin:{
        type: Boolean,
    }


});

const User = mongoose.model('User', userSchema);
module.exports = User;
