const express = require('express')
const router = express.Router()

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")


router.post("/register",userController.createUser)
router.post("/login", userController.userLogin)











module.exports = router