// Requiring dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Require models
const db = require('./models');

// Setting up Port
const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Require routes
const routes = require('./routes');

// Configure middleware

// Parse request body as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Have every request go through route middleware
app.use(routes);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// For now, I serve my html in the server so that I can easily pass the data into it.
// I am working on making a controller for my views.js files.


// Default/Home route
app.get('/',(req, res)=>{
    // Targets all articles in the DB that are NOT saved
    db.Article.find({saved: false})
        .then((data)=>{
            // Data comes back as an array of objects,
            // I made the variables to target the data I need to pass into handlebars
            const id = data.map((res)=>{return res._id});
            const title = data.map((res)=>{return res.title});
            const link = data.map((res)=>{return res.link});
            const summary = data.map((res)=>{return res.summary});
            const saved = data.map((res)=>{return res.saved});

            // An object of data to pass to handlebars to use
            const articleObj = {
                article: data,
                id: id,
                title: title,
                link: link,
                summary: summary,
                saved: saved
            };

            // Sends the index.handlebars file and the data to populate it
            res.render('index', articleObj);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client
            res.json(err);
        });
});

// Route for saving articles
app.get('/saved', (req, res)=>{
    // Targets all articles in the DB the are saved
    db.Article.find({saved: true})
        .then((data)=>{
            // Data comes back as an array of objects,
            // I made the variables to target the data I need to pass into handlebars
            const id = data.map((res)=>{return res._id});
            const title = data.map((res)=>{return res.title});
            const link = data.map((res)=>{return res.link});
            const summary = data.map((res)=>{return res.summary});

            // An object of data to pass to handlebars to use
            const articleObj = {
                article: data,
                id: id,
                title: title,
                link: link,
                summary: summary
            };
            // Sends the saved.handlebars file and the data to populate it
            res.render('saved', articleObj);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client
            res.json(err);
        });
});

// Starts the server
app.listen(PORT, ()=>{
    console.log("App running on port " + PORT + "!");
});