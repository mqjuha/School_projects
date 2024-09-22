const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const AboutUs = require('../models/AboutUs.js');

function quit () {
    process.exit();
}

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority')
.then(() => {
    console.log('connected');
    var person = new AboutUs({ 
        name: 'FirstName LastName', 
        job: 'Student', 
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam nibh purus, porta sit amet ultrices in, aliquet sed libero. Nulla a accumsan turpis. Cras aliquet, nunc sollicitudin bibendum iaculis, arcu ante pellentesque nisl, nec tristique nibh quam eu lorem. Vivamus vel quam a neque molestie pulvinar. Sed nec euismod est. Vestibulum at luctus tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi ullamcorper lacus a tortor iaculis fringilla.', 
        img: 'https://cdn.pixabay.com/photo/2019/02/08/15/34/girl-3983410_1280.jpg',
        linkedin: '',
        email: 'first.last@gmail.com'
    });

    person.save().then(() => quit() );
});