const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TimelineVer = require('../models/TimelineVertical.js');

function quit () {
    process.exit();
}

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority')
.then(() => {
    console.log('connected');
    var table = new TimelineVer({
        title: 'Software Development Process',
        dots: [{
            link: '6509a7fd1276d0845f8690b5',
            main_text: 'Requirement analysis',
            secondary_text: 'First step',
        }, {
            main_text: 'Planning',
        }, {
            link: '6509a7fe1276d0845f8690b7',
            main_text: 'Architectural Design',
        }, {
            main_text: 'Development',
        }, {
            link: '6509a7ff1276d0845f8690b9',
            main_text: 'Testing',
        }, {
            main_text: 'Deployment',
        }, {
            main_text: 'Maintenance',
            secondary_text: 'Last step',
        }]
    });

    table.save().then(() => quit() );
});