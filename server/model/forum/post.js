import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const Posts = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    child: { type: Schema.Types.ObjectId, ref: 'ForumChilds' },
    topic: { type: Schema.Types.ObjectId, ref: 'ForumTopics' },
    //Main
    creator: { type: Schema.Types.ObjectId, ref: 'Users' },
    content: { type: String },
    date: { type: Date, default: Date.now },

}, { toJSON: { virtuals: true } });

module.exports = Posts;