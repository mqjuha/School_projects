const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const ReferenceSchema = new Schema({
    authors: {type: String, require: false},
    year: {type: Date, require: false},
    title: {type: String, require: true},
    source: [{ 
        book_title: {type: String, require: false},
        edition: {type: String, require: false},
        publisher: {type: String, require: false},
        address: {type: String, require: false},
    },
    { 
        journal_name: {type: String, require: false},
        volume: {type: Number, require: false},
        number: {type: Number, require: false},
    }],
    pages: {type: String, require: false},
    series: {type: String, require: false},
    access_date: {type: Date, require: false},
    url: {type: String, require: false},
}, { collection: 'references'});

const Reference =  model('Reference', ReferenceSchema);

module.exports = Reference;