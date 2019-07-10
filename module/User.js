const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    userName: {
        type: String,
        rquired: true,
    },
    phoneNumber: {
        type: String,
        rquired: true,
    },
    passWord: {
        type: String,
        rquired: true,
    },
    identity: {
        type: String,
        rquired: false,
        default: 'user',
    },
    isActive: {
        type: Boolean,
        rquired: false,
        default: false,
    },
    create_at: {
        type: Date,
        default: Date.now,
    },
});
module.exports = User = mongoose.model('Blog_User', UserSchema);
