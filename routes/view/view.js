// Requiring Express Router
const router = require("express").Router();

// Requiring controller
const controller = require("../../controllers/controller");

// Setting Routes
router.get("/", (req, res)=>{
  res.render("index");
});

router.get("/saved", (req, res)=>{
  res.render("saved");
});

// Exporting Routes
module.exports = router;