'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
const Posts = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    child: { type: Schema.Types.ObjectId, ref: 'ForumChilds' },
    topic: { type: Schema.Types.ObjectId, ref: 'ForumTopics' },
    //Main
    creator: { type: Schema.Types.ObjectId, ref: 'Users' },
    content: { type: String },
    date: { type: Date, default: Date.now }

}, { toJSON: { virtuals: true } });

module.exports = Posts;
//# sourceMappingURL=post.js.map