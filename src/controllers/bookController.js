const bookModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const { isValidId, isValid, isValidIsbn } = require("../validator/validator")
const mongoose = require('mongoose')
const ObjectId =  mongoose.Types.ObjectId 

//________________ Create Books ___________________//


const createBooks = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ message: "please provide some data", error: "data can't be empty" })
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req.body
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required ,title should be in string" })
        let validtitle = await bookModel.findOne({ title: title })
        if (validtitle) return res.status(400).send({ status: false, message: "Title is already exists" })

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt is required ,excerpt should be in string" })

        if (!userId) return res.status(400).send({ status: false, message: "userId is required" })
        if (!isValidId(userId)) {
            return res.status(400).send({ status: false, message: "enter valid user id" })
        }
        let checkuserId = await userModel.findById(userId)

        if (!checkuserId) return res.status(404).send({ status: false, message: "User is not found" })

        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is required ,ISBN should be in string" })
        if (!isValidIsbn(ISBN)) return res.status(400).send({ status: false, message: "ISBN is not valid" })
        let validISBN = await bookModel.findOne({ ISBN: ISBN })
        if (validISBN) return res.status(400).send({ status: false, message: "ISBN is already exists" })

        if (!isValid(category)) return res.status(400).send({ status: false, message: "category is required ,category should be in string" })

        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is required ,Subcategory should be in string" })

        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt should required, releaseAt should be in Date" })


        let bookcreate = await bookModel.create(req.body)
        res.status(201).send({ status: true, message: "Success", data: bookcreate })


    } catch (err) {
        res.status(500).send({ status: false, message: "Server Error", error: err.message })
    }
}
//-------------------------------------BooksByQuery----------------------------------------------------//

const getBooksByQuery = async function (req, res) {
    try {
        let Query = req.query

        let getBook = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

        if (Object.keys(Query).length == 0) return res.status(200).send({ status: true, message: 'Book List', data: getBook })

        if (Query.userId == "") return res.status(400).send({ status: false, msg: "Please provide User Id" });
        if (Query.userId) {
            if (!ObjectId.isValid(Query.userId)) {
                return res.status(400).send({ status: false, msg: "User Id is invalid" });
            }
        }

        let getBooks = await bookModel.find({ $and: [Query, { isDeleted: false }] }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

        if (getBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        res.status(200).send({ status: true, message: "Book List", data: getBooks })
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Server Error", error: err.message })
    }
}

//-----------------------------------getBooksId-----------------------------------------------------//

const getBooksId = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter valid book Id" })
        }

        let books = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!books) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        return res.status(200).send({ status: true, message: 'Books list', data: books })


    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })
    }
}

module.exports = { createBooks, getBooksId, getBooksByQuery }