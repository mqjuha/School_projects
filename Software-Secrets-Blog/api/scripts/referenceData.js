const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const Reference = require('../models/Reference.js');

function quit () {
    process.exit();
}

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority')
.then(() => {
    console.log('connected');
    var reference = new Reference({
        authors: 'Hassenzahl, M',
        year: new Date(2010),
        title: 'Experience design: technology for all the right reasons',
        source: [{
            publisher: 'Morgan & Claypool Publishers',
        }],
    });

    reference.save().then(() => quit() );
});