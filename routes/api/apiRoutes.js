// Requiring Express Router
const router = require("express").Router();

// Requiring controller
const controller = require("../../controllers/controller");

// Setting Routes
router.get("/scrape", controller.scrape);
router.post("/articles/delete", controller.deleteAll);
router.delete("/articles/:id", controller.deleteArticle);
router.put('/saved/:id', controller.save);
router.get('/articles/:id', controller.openComments);
router.post('/articles/:id', controller.saveComment);
router.get('/comments/:id', controller.getComment);

// Exporting Routes
module.exports = router;