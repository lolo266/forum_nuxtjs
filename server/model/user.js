const   mongoose = require("mongoose");
const   Schema = mongoose.Schema;

const Users = new Schema({
    auth: {
        username: { type: String },
        password: { type: String }
    },
    profile: {
        name: { type: String },
        email: { type: String },
        image: { type: String, default: '/image/user.png'},
        background: { type: String, default: 'https://i.imgur.com/DOqfPpz.jpg'},
        date: { type: Date, default: Date.now}
    },
    role: {type: Number, default: 0},
    online: {type: Boolean, default: false},
}, { toJSON: { virtuals: true } });

Users.virtual('topics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'creator',
});

Users.virtual('numTopics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'creator',
    count: true
});

module.exports = Users;