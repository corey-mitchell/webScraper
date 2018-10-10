// Require Mongoose
const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// Create a new Comment Schema
const CommentSchema = new Schema({
    body: {
        type: String,
        required: true
    }
});

// Creates model from the above Schema
const Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;