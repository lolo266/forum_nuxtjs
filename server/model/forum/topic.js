import mongoose from 'mongoose';
import * as StringLib from '../../plugins/stringcase' ;

const Schema = mongoose.Schema;
const Topics = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    child: { type: Schema.Types.ObjectId, ref: 'ForumChilds' },
    //Main
    creator: { type: Schema.Types.ObjectId, ref: 'Users' },
    title: { type: String },
    content: { type: String },
    date: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now },
    link: { type: String , default: function(){
        if(this.title) return StringLib.Case(this.title, '-');
        return null;
    }},
    view: { type: Number, default: 0 },
    //Setting
    lock: { 
        all: { type : Boolean, default: false },
        post: { type : Boolean, default: false },
        info: { type: String }
    }
}, { toJSON: { virtuals: true } });

//Virtual
Topics.virtual('posts', {
    ref: 'ForumPosts',
    localField: '_id',
    foreignField: 'topic',
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
