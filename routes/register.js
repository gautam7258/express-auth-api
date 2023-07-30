const express = require("express");
const router = express.Router();
const resgisterController = require("../controllers/registerController");

router.post("/",resgisterController.handleRegister)

module.exports = router;