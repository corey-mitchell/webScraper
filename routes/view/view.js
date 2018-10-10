// Requiring Express Router
const router = require("express").Router();

// Requiring controller
const controller = require("../../controllers/controller");

// Setting Routes
router.get("/saved", (req, res)=>{
  res.render("saved", controller.findAll);
});

router.use("/", (req, res)=>{
  res.render("index");
});

// Exporting Routes
module.exports = router;