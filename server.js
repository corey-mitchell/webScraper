// Requiring dependencies
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');

// Require models
const db = require('./models');

// Setting up Port
const PORT = process.env.PORT || 8080;

// Initialize Express
const app = express();

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// Connects to remote mongolab DB if deployed, else connects to local DB.
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

// Scrapes website
app.get('/scrape', (req, res)=>{
    // Gets HTML body
    axios.get('').then((response)=>{
        // Loads cheerio into a shorthand selector
        const $ = cheerio.load(response.data);

        // Target specific divs here.

        // Create new articles here.
    });
});

// Route to get all articles from the DB
app.get('/articles', (req, res)=>{
    // Grabs every document in the Articles collection
    db.Article.find()
        .then((dbArticle)=>{
            // If we find articles, they are sent back to the client
            res.json(dbArticle);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client instead
            res.json(err);
        });
});

// Route for grabbing a specific article by id, populate it with it's comments
app.get('/articles/:id', (req, res)=>{
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({_id: req.params.id})
        // ..and populate all of the notes associated with it
        .populate("comment")
        .then((dbArticle)=>{
            // If we find articles, they are sent back to the client with the comments attached
            res.json(dbArticle);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client instead
            res.json(err);
        });

});


// Starts the server
app.listen(PORT, ()=>{
    console.log("App running on port " + PORT + "!");
});