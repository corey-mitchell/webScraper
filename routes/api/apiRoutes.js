// Requiring Express Router
const router = require("express").Router();

// Requiring controller
const controller = require("../../controllers/controller");

// Setting Routes

// Route for scraping articles
router.get("/scrape", controller.scrape);

// Route for deleting ALL articles
router.post("/articles/delete", controller.deleteAll);

// Route for deleting One article
router.delete("/articles/:id", controller.deleteArticle);

// Route for saving article
router.put('/saved/:id', controller.save);

router.put('/commentRefence/:articleId/:commentId', controller.deleteReference);

// Route for opening comments modal
router.get('/articles/:id', controller.openComments);

// Route for saving comment
router.post('/articles/:id', controller.saveComment);

// Route for passing comment ID back to DB for comment body
router.get('/comments/:id', controller.getComment);

// Route for deleting comment
router.delete('/comments/:id', controller.deleteComment);

// Exporting Routes
module.exports = router;