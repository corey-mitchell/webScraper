// Requiring dependencies
const express = require('express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Make public a static folder
app.use(express.static("public"));

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// Routes

app.get('/',(req, res)=>{
    res.render('index');
})

// Scrapes website
app.get('/scrape', (req, res)=>{
    // Gets HTML body
    axios.get('https://www.austinchronicle.com/daily/news/').then((response)=>{
        // console.log(response.data);
        // Loads cheerio into a shorthand selector
        const $ = cheerio.load(response.data);

        // Target specific divs here.
        $("div.blog-text").each((i, element)=>{
            // Save an empty result object
            let result = {};

            // Add the text, link and summary of every article, and save them as properties of the result object
            result.title = $(element)
                .children('a')
                .text();

            result.link = `https://www.austinchronicle.com${$(element)
                .children('a')
                .attr('href')}`

            result.summary = $(element)
                .children('div')
                .text();

            // console.log(result);

            // This is where I'm currently at. It works but I need to prevent it from creating dublicate docs.

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then((dbArticle)=>{
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch((err)=>{
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
        });

        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");

    });
});


// Everything below this (except for the port listen function) is still in testing


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