'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _stringcase = require('../../plugins/stringcase');

var StringLib = _interopRequireWildcard(_stringcase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
const Topics = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    child: { type: Schema.Types.ObjectId, ref: 'ForumChilds' },
    //Main
    creator: { type: Schema.Types.ObjectId, ref: 'Users' },
    title: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now },
    link: { type: String, default: function () {
            if (this.title) return StringLib.Case(this.title, '-');
            return null;
        } },
    images: [{
        id: { type: String },
        type: { type: String }
    }],
    //Setting
    setting: {
        noftication: { type: Boolean, default: false },
        post: { type: Boolean, default: false }
    },
    lock: { type: Boolean, default: false },
    update: { type: Date, default: Date.now }
}, { toJSON: { virtuals: true } });

//Virtual
Topics.virtual('posts', {
    ref: 'ForumPosts',
    localField: '_id',
    foreignField: 'topic'
});

Topics.virtual('numPosts', {
    ref: 'ForumPosts',
    localField: '_id',
    foreignField: 'topic',
    count: true
});

//Index
Topics.index({ link: 'text' });

module.exports = Topics;
//# sourceMappingURL=topic.js.map