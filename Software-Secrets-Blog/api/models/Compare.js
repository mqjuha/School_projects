const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const CompareSchema = new Schema({
    variant: String,
    entries: [{
        title: String,
        content: String
    }]
});

const CompareModel =  model('Compare', CompareSchema);

module.exports = CompareModel;