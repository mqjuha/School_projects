const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const AboutUs = require('./models/AboutUs.js');

const { MongoClient } = require("mongodb");

const Reference = require('./models/Reference');
const Post = require('./models/Post_item');
const fs = require('fs');

const About = require('./models/AboutUs');
const TimelineVer = require('./models/TimelineVertical');
const TimelineHor = require('./models/TimelineHorizontal');
const Ref = require('./models/Reference.js');
const TableComponent = require('./models/Table.js')

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://SSB-user:g11zWMpLH6MZnuiD@cluster0.gf98q4b.mongodb.net/secrets?retryWrites=true&w=majority');

app.post('/', async (req,res) => {
    console.log('TOimiiks');

});

app.get('/aboutus', async (req,res) => {
    console.log('GET: AboutUs');
    res.json(
      await About.find({})
    );
});

app.get('/blog', async (req,res) => {
    res.json(
      await Post.find()
    );
});

app.get('/blog/:id', async (req, res) => {

    console.log("GET: Article")
    const {id} = req.params;

    res.json(
        await Post.findById(id)
    );

});

app.get('/timelineHor/:id', async (req, res) => {
    console.log("GET: TimelineHor")
    const {id} = req.params;

    res.json(
        await TimelineHor.findById(id)
    );
});

app.get('/timelineVer/:id', async (req, res) => {
    console.log("GET: TimelineVer")
    const {id} = req.params;

    res.json(
        await TimelineVer.findById(id)
    );
});

app.get('/tableComponent/:id', async (req,res) => {
    console.log('GET: Table');
    const {id} = req.params;
    res.json(
      await TableComponent.findById(id)
    );
});

app.get('/reference/:id', async (req,res) => {
    console.log('GET: Reference');
    const {id} = req.params;
    res.json(
      await Ref.findById(id)
    );
});

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});