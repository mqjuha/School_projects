const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TableSchema = new Schema({
    title: {type: String, require: true},
    table: {
        header_row: [{type: String, require: true}],
        content: [{
            navigation: { type: mongoose.Schema.Types.ObjectId, ref:'Reference', require: false},
            items: [{type: String, require: true}],
        }]  
    }
}, { collection: 'table'});

const Table =  model('Table', TableSchema);

module.exports = Table;