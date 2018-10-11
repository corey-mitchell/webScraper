// Require Dependencies
const axios = require('axios');
const cheerio = require('cheerio');

// Require models
const db = require('../models');

// Exports methods
module.exports = {
    // Scrapes website for articles
    scrape: (req, res)=>{
            axios.get('https://www.kxan.com/news/local/austin').then((response)=>{
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
        });
    },
    // Deletes ALL articles in the DB
    deleteAll: (req, res)=>{
        db.Article.deleteMany()
            .then(()=>{
                // Alert Client that the articles have been cleared
                console.log('Articles cleared.')
            })
            .catch((err)=>{
                // If an error occurs, send the err to the client
                res.json(err);
            });        
    },
    // Deletes ONE article
    deleteArticle: (req, res)=>{
        db.Article.findOneAndDelete({_id: req.params.id})
            .then((dbArticle)=>{
                // Send article back to the client
                res.json(dbArticle);
            })
            .catch((err)=>{
                // If an error occurs, send the err to the client
                res.json(err);
            });        
    },
    // Saves article
    save: (req, res)=>{
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
    },
    // Targets specific article to comment on
    openComments: (req, res)=>{
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
    },
    // Saves/Updates article's associated comments
    saveComment: (req, res)=>{
        db.Comment.create(req.body)
            .then((dbComment)=>{
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`.
                // Update the Article to be associated with the new Note
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { comments: dbComment._id }, { new: true });
            })
            .then((dbArticle)=>{
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch((err)=>{
                // If an error occurred, send it to the client
                res.json(err);
            });        
    },
    // Trades comment id for comment body
    getComment: (req, res)=>{
        db.Comment.findOne({_id: req.params.id})
            .then((dbComment)=>{
                res.json(dbComment);
            })
            .catch((err)=>{
                res.json(err);
            });
    },
    // Deletes comment
    deleteComment: (req, res)=>{
        db.Comment.findOneAndDelete({_id: req.params.id})
            .then((dbComment)=>{
                // Send comment back to client
                res.json(dbComment);
            })
            .catch((err)=>{
                // If an error occurs, send the err to the client
                res.json(err);
            });
    }    
};