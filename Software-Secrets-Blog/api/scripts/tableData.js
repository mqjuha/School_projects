const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const Table = require('../models/Table.js');

function quit () {
    process.exit();
}

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority')
.then(() => {
    console.log('connected');
    var table = new Table({
        title: "Table2",
        table: {
            header_row: ["Level", "Tester", "Project Phase"],
            content: [{
                navigation: '650c7ad3bf3dec6edb871381',
                items: ["Unit", "Developer", "Implementation"],
            },
            {
                items: ["Integration", "Developer", "Implementation"],
            },
            {
                link: '650c7ad6bf3dec6edb871383',
                items: ["System", "Tester", "Final phase"],
            },
            {
                items: ["Acceptance", "Customer", "Final phase"],
            }
            ] 
        }
    });

    table.save().then(() => quit() );
});