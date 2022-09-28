const jwt = require('jsonwebtoken')
const bookModel = require('../models/booksModel')
const { isValidId } = require("../validator/validator")

//_________________________________ authontication ____________________________________________//

const Authentication = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, message: "Header must be present !" })
        jwt.verify(token, "Project3-Group24", async (invalid, valid) => {
            //-----if token is invalid-------/
            if (invalid) return res.status(401).send({ status: false, message: "Invalid token !" })
            //----if token valid----//
            if (valid) {
            req["userId"] = valid.userId
            next()
            }
        })
    } catch (error) {
        return res.status(500).send({ sataus: false, message: error.message })
    }
}

//____________________________________ authorization __________________________________________________________//

const Authorization = async (req, res, next) => {
    try {
        let token = req.headers['x-api-key']
        if (!token) return res.status(400).send({ status: false, msg: "Header must be present !" })

        let bookid = req.params.bookId
        if (!isValidId(bookid)) {
            return res.status(400).send({ status: false, message: "Enter valid book Id" })
        }

        let book = await bookModel.findOne({ _id: bookid, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "Book not found" })
        let userId = book.userId
        jwt.verify(token, "Project3-Group24", async (invalid, valid) => {
            //-----if token is invalid-------/
            if (invalid) return res.status(401).send({ status: false, message: "Invalid token !" })
            //----if token valid----//
            if (valid) {
                if (valid.userId == userId) {
                    next()
                } else {
                    return res.status(403).send({ status: false, message: "You have unauthorized person !" })
                }
            }
        })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { Authentication, Authorization }