// Require Mongoose
const mongoose = require('mongoose');

// Save a reference to the schema constructor
const Schema = mongoose.Schema;

// Create a new Article Schema
const ArticleSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    }
});

// Creates model from above schema
const Article = mongoose.model("Article", ArticleSchema);

// Exports the Article Model
module.exports = Article;