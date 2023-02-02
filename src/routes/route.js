const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const aws = require("../middlewares/awsLink");


router.post("/register",aws.awsLink, userController.register);
router.post("/login", userController.loginUser)

module.exports = router;
