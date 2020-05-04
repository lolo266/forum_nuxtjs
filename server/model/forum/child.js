import mongoose from 'mongoose';
import * as StringLib from '../../plugins/stringcase' ;

const Schema = mongoose.Schema;
const Childs = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'ForumCategorys' },
    title: { type: String },
    mod: [
        {type: Schema.Types.ObjectId, ref: 'Users'}
    ],
    vip: { type: Boolean, default: false },
    link: { type: String , default: function(){
        if(this.title) return StringLib.Case(this.title, '-');
        return null;
    }},
    date: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true } });

//Virtual
Childs.virtual('topics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'child',
});

Childs.virtual('numTopics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'child',
    count: true
});

Childs.virtual('numPosts', {
    ref: 'ForumPosts',
    localField: '_id',
    foreignField: 'child',
    count: true
});

module.exports = Childs;