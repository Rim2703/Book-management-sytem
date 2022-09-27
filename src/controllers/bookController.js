const bookModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const { isValidId, isValid, isValidIsbn, isValidDate } = require("../validator/validator")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

//________________________________________ Create Books _________________________________________________________//


const createBooks = async function (req, res) {
    try {
        //________________________________ request body using data _______________________________//
        books = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = books

        if (Object.keys(books).length == 0) return res.status(400).send({ message: "please provide some data", error: "data can't be empty" })

        //___________________________________ title validation ____________________________________//

        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required ,title should be in string" })

        //____________________________ valiation for dublicate title or not ________________________// 

        let validtitle = await bookModel.findOne({ title: title })
        if (validtitle) return res.status(400).send({ status: false, message: "Title is already exists" })

        //______________________________ validation for excerpt ___________________________________//

        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt is required ,excerpt should be in string" })

        //______________________________ validation for userId ___________________________________//

        if (!userId) return res.status(400).send({ status: false, message: "userId is required" })
        //_______________________________ check user regex _______________________________________//

        if (!isValidId(userId)) return res.status(400).send({ status: false, message: "enter valid user id" })

        //_______________________________ dublicate userId or not ________________________________//

        let checkuserId = await userModel.findById(userId)
        if (!checkuserId) return res.status(404).send({ status: false, message: "User is not found" })

        //________________________________ validation for ISBN _________________________________//
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN is required ,ISBN should be in string" })
        if (!isValidIsbn(ISBN)) return res.status(400).send({ status: false, message: "ISBN is not valid" })
        let validISBN = await bookModel.findOne({ ISBN: ISBN })
        if (validISBN) return res.status(400).send({ status: false, message: "ISBN is already exists" })

        //____________________validation for catagory,subcatagory and releaseAt_________________//

        if (!isValid(category)) return res.status(400).send({ status: false, message: "category is required ,category should be in string" })

        if (!isValid(subcategory)) return res.status(400).send({ status: false, message: "Subcategory is required ,Subcategory should be in string" })

        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "ReleasedAt should required, releaseAt should be in Date" })
        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "reviewedAt should be (yyyy-mm-dd) format and enter valid month , day and year" })

        let bookcreate = await bookModel.create(req.body)
        res.status(201).send({ status: true, message: "Success", data: bookcreate })

    } catch (err) {
        res.status(500).send({ status: false, message: "Server Error", error: err.message })
    }
}

//________________________________________ BooksByQuery _________________________________________________________//

const getBooksByQuery = async function (req, res) {
    try {
        let Query = req.query

        let getBook = await bookModel.find({ isDeleted: false })
            .select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
            .sort({ title: 1 })

        getBook.sort((a, b) => a.title.localeCompare(b.title))

        if (Object.keys(Query).length == 0) return res.status(200).send({ status: true, message: 'Book List', data: getBook })

        if (Query.userId == "") return res.status(400).send({ status: false, msg: "Please provide User Id" });

        if (Query.userId) {
            if (!ObjectId.isValid(Query.userId)) {
                return res.status(400).send({ status: false, msg: "User Id is invalid" });
            }
        }

        let getBooks = await bookModel.find({ $and: [Query, { isDeleted: false }] })
            .select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
            .sort({ title: 1 })

        getBooks.sort((a, b) => a.title.localeCompare(b.title))

        if (getBooks.length == 0) {
            return res.status(404).send({ status: false, message: "No book found" })
        }

        res.status(200).send({ status: true, message: "Book List", data: getBooks })
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Server Error", error: err.message })
    }
}

//_________________________________________ Books by param _____________________________________________________//

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

        // Returns a book with complete details including reviews
        const review = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1 })
        let count = review.length
        if (!review) {
            return res.status(400).send({ status: false, message: "no review exists with this id" })
        }

        // merge reviewData key in book document
        books._doc["reviewsData"] = review

        //    update counts of reviews 
        books._doc["reviews"] = count

        res.status(200).send({ status: true, message: 'Books list', data: books })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })
    }
}

//__________________________________________ Update Books _____________________________________________________//

const updateBooks = async function (req, res) {
    try {
        let books = req.params.bookId

        let bookdata = req.body
        let { title, excerpt, releasedAt, ISBN } = bookdata

        if (Object.keys(bookdata).length == 0) return res.status(400).send({ status: false, message: "please provide some data" })

        let checkbook = await bookModel.findOne({ _id: books, isDeleted: false })
        if (!checkbook) {
            return res.status(404).send({ status: false, message: "Books are not found or bookid is not valid" })
        }

        // unique title 
        let Title = await bookModel.findOne({ title: bookdata.title, isDeleted: false })
        if (Title) return res.status(400).send({ status: false, message: "given title already exit" })

        // unique ISBN
        let isbn = await bookModel.findOne({ ISBN: bookdata.ISBN, isDeleted: false })
        if (isbn) return res.status(400).send({ status: false, message: "given isbn Number already exit" })

        if (releasedAt) {
            if (!isValidDate(releasedAt))
                return res.status(400).send({ status: false, message: "releaseAt should be (yyyy-mm-dd) format and enter valid month , day and year" })
        }

        // Updating data in book document
        let updatedata = await bookModel.findOneAndUpdate({ _id: books, isDeleted: false },
            { $set: { title: title, excerpt: excerpt, releasedAt: releasedAt, ISBN: ISBN } },
            { new: true })

        res.status(200).send({ status: true, message: "Success", data: updatedata })

    } catch (err) {
        res.status(500).send({ status: false, message: "Server Error", error: err.message })
    }
}

//__________________________________ delete by params _____________________________________________________//

const deleteBooksId = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter valid book id" })
        }

        let books = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!books) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        let deletebooks = await bookModel.findByIdAndUpdate(bookId
            , { isDeleted: true, deletedAt: Date.now() }
            , { new: true })

        res.status(200).send({ status: true, message: 'Books is deleted successfully' })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })

    }
}

module.exports = { createBooks, getBooksByQuery, getBooksId, updateBooks, deleteBooksId }