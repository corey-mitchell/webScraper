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
})

// Route for scraping website
app.get('/scrape', (req, res)=>{
    // Gets HTML body
    axios.get('https://www.kxan.com/news/local/austin').then((response)=>{
        // console.log(response.data);
        // Loads cheerio into a shorthand selector
        const $ = cheerio.load(response.data);

        // Targets information from website and passes it into the DB. 
        $("div.headline-wrapper").each((i, element)=>{
            // Save an empty result object
            let result = {};

            // Add the text, link and summary of every article, and save them as properties of the result object
            result.title = $(element)
                .children('h4')
                .children('a')
                .text();

            result.link = `https://www.kxan.com${$(element)
                .children('h4')
                .children('a')
                .attr('href')}`;

            result.summary = $(element)
                .children('p')
                .text();

            // Logs out result to make sure info is correct before adding to DB
            // console.log(result);

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then((dbArticle)=>{
                    // View the added result in the console
                    res.json(dbArticle);
                })
                .catch((err)=>{
                    // If an error occurred, send it to the client
                    res.json(err);
                });
        });
        // If we were able to successfully scrape and save an article, send a message to the client
        // res.send("Scrape Complete");
    });
});

// Route for deleting ALL articles
app.post('/articles/delete', (req, res)=>{
    db.Article.deleteMany()
        .then(()=>{
            // Alert Client that the articles have been cleared
            console.log('Articles cleared.')
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client
            res.json(err);
        });
});

// Route for changing article's 'saved' state
app.put('/saved/:id', (req, res)=>{
    // Targets article by ID then changes saved state to true
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true}, {new: true})
        .then((dbSaved)=>{
            // Send article back to the client
            res.json(dbSaved);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client
            res.json(err);
        });
});

// Route for deleting specific articles
app.delete('/articles/:id', (req, res)=>{
    db.Article.findOneAndDelete({_id: req.params.id})
        .then((dbArticle)=>{
            // Send article back to the client
            res.json(dbArticle);
        })
        .catch((err)=>{
            // If an error occurs, send the err to the client
            res.json(err);
        });
});

// Route for grabbing a specific article by id, populate it with it's comments
app.get('/articles/:id', (req, res)=>{
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({_id: req.params.id})
        // ..and populate all of the comments associated with it
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

// Route for saving/updating Article's associated comments
app.post('/articles/:id', (req, res)=>{
    db.Comment.create(req.body)
        .then((dbComment)=>{
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`.
            // Update the Article to be associated with the new Note
            return db.Article.findOneAndUpdate({id: req.params.id}, {comment: dbComment._id}, {new: true});
        })
        .then((dbArticle)=>{
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch((err)=>{
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Starts the server
app.listen(PORT, ()=>{
    console.log("App running on port " + PORT + "!");
});