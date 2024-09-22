const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TimelineHorSchema = new Schema({
    title: {type: String, require: true},
    dots: [{
        link: { type: mongoose.Schema.Types.ObjectId, ref:'Reference', require: false},
        text: {type: String, require: true},
        active: {type: Boolean, require: false},
    }]
}, { collection: 'timeline_hor'});


const TimelineHor =  model('TimelineHor', TimelineHorSchema);

module.exports = TimelineHor;