"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Users = new Schema({
    auth: {
        username: { type: String },
        password: { type: String }
    },
    profile: {
        name: { type: String },
        email: { type: String },
        image: { type: String, default: '/image/user.png' },
        date: { type: Date, default: Date.now }
    }
});
module.exports = Users;
//# sourceMappingURL=user.js.map