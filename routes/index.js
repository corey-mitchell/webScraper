// Requiring Express Router
const router = require("express").Router();

// Requiring routes
const apiRoutes = require("./api/apiRoutes");
// const viewRoutes = require("./view/view.js");

// Setting Routes
router.use("/api", apiRoutes);
// router.use("/", viewRoutes);

// Exporting Routes
module.exports = router;