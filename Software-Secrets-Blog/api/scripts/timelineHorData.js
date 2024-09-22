const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TimelineHor = require('../models/TimelineHorizontal.js');

function quit () {
    process.exit();
}

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority')
.then(() => {
    console.log('connected');
    var table = new TimelineHor({
        title: 'Experience-driven Design',
        dots: [{
            link: '65099b6d1276d0845f8690a4',
            text: 'User study',
            active: true,
        }, {
            link: '65099c051276d0845f8690aa',
            text: 'Experience goals',
            active: true,
        }, {
            text: 'Implementation',
            active: false,
        }, {
            link: '65099c041276d0845f8690a8',
            text: 'Usability tests',
            active: false,
        }]
    });

    table.save().then(() => quit() );
});