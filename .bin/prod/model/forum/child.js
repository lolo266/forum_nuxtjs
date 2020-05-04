'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _stringcase = require('../../plugins/stringcase');

var StringLib = _interopRequireWildcard(_stringcase);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;
const Childs = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    title: { type: String },
    mod: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    vip: { type: Boolean, default: false },
    link: { type: String, default: function () {
            if (this.title) return StringLib.Case(this.title, '-');
            return null;
        } }
}, { toJSON: { virtuals: true } });

//Virtual
Childs.virtual('topics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'child'
});

Childs.virtual('numTopics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'child',
    count: true
});

module.exports = Childs;
//# sourceMappingURL=child.js.map