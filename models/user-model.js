const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Admin: {
        type: Boolean,
        required: true
    },
    Comments: {
        type: Array,
        required: true
    },
    comms: {
        type: Number,
        required: true
    },
    likes: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);