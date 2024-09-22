const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const AboutUsSchema = new Schema({
    name: {type: String, require: true},
    job: {type: String, require: true},
    desc: {type: String, require: true},
    img: {type: String, require: true},
    linkedin: {type: String, require: true},
    email: {type: String, require: true},    
}, { collection: 'about_us'});

const AboutUs =  model('AboutUs', AboutUsSchema);

module.exports = AboutUs;