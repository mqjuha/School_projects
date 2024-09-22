const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new Schema({
    category: String,
    title: String,
    date: Date,
    cover: String,
    keywords: [String],
    abstract: String,
    nav: {
        nav_type: String,
        element: Schema.ObjectId
    },
    content: [String],
    summary: String,
    references: [Schema.ObjectId]
}, { collection: 'posts' });

const PostModel =  model('Post', PostSchema);

module.exports = PostModel;