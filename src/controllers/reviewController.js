const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const { isValid } = require("../validator/validator")
const mongoose = require('mongoose')
const ObjectId =  mongoose.Types.ObjectId

const createReviews = async function (req, res) {
    let bookId = req.params.bookId
    
    if (bookId) {
        if (!ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, msg: "Book Id is invalid" });
        }
    }
    let book = await booksModel.findOne({_id: bookId, isDeleted: false })
    if (!book) return res.status(400).send({ status: false, message: "Book does not exist!!" })
    
    let data = req.body
    if (Object.keys(data).length == 0) return res.status(400).send({ message: "please provide some data", error: "data can't be empty" })
    let { reviewedBy, reviewedAt, rating, review } = data

    if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewer name is required ,it should be in string" })
    if (!isValid(reviewedAt)) return res.status(400).send({ status: false, message: "ReviewedAt is required, reviewedAt should be in Date" })
    if (!isValid(rating)) return res.status(400).send({ status: false, message: "Rating should required, rating should be a number" })
    if(typeof rating<1 || rating> 5) return res.status(400).send({status: false, message: "Please provide rating in between 1 to 5"})
    if (!isValid(review)) return res.status(400).send({ status: false, message: "Review is required, please give reviews for the book" })

    data.bookId = bookId

    let createReview = await reviewModel.create(data)
    let updateBook = await booksModel.findOneAndUpdate({_id: bookId}, {$inc: {reviews: 1}}, {new: true})
    
updateBook = updateBook._id

    res.status(201).send({ status: true, message: "Review created", data: createReview})
}

module.exports = { createReviews }