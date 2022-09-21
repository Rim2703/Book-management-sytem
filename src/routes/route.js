const express = require('express')
const router = express.Router()

const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")


router.post("/register", userController.createUser)
router.post("/login", userController.userLogin)
router.post("/books", bookController.createBooks)
router.get("/books/:bookId", bookController.getBooksId)
router.get("/books", bookController.getBooksByQuery)


module.exports = router