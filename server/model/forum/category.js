import mongoose from 'mongoose';
import * as StringLib from '../../plugins/stringcase' ;

const Schema = mongoose.Schema;
const Categorys = new Schema({
    title: { type: String },
    smod: { type: Schema.Types.ObjectId, ref: 'Users' },
    link: { type: String , default: function(){
        if(this.title) return StringLib.Case(this.title, '-');
        return null;
    }},
    date: { type: Date, default: Date.now },
}, { toJSON: { virtuals: true } });

//Virtual
Categorys.virtual('childs', {
    ref: 'ForumChilds',
    localField: '_id',
    foreignField: 'category',
});

Categorys.virtual('numTopics', {
    ref: 'ForumTopics',
    localField: '_id',
    foreignField: 'category',
    count: true
});

module.exports = Categorys;