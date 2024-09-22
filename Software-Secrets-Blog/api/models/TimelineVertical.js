const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TimelineVerSchema = new Schema({
    title: {type: String, require: true},
    dots: [{
        link: { type: mongoose.Schema.Types.ObjectId, ref:'Reference', require: false},
        main_text: {type: String, require: true},
        secondary_text: {type: String, require: false},
    }]
}, { collection: 'timeline_ver'});

const TimelineVer =  model('TimelineVer', TimelineVerSchema);

module.exports = TimelineVer;