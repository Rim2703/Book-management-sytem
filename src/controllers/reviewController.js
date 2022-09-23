const booksModel = require("../models/booksModel")
const reviewModel = require("../models/reviewModel")
const { isValid, isValidId } = require("../validator/validator")
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

//______________________________Create Reviews___________________________________//

const createReviews = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (bookId) {
            if (!ObjectId.isValid(bookId)) {
                return res.status(400).send({ status: false, message: "Book Id is invalid" });
            }
        }
        // checking book is present in db
        let book = await booksModel.findOne({ _id: bookId, isDeleted: false }).lean()      //using lean u can add key in existing document 

        if (!book) return res.status(400).send({ status: false, message: "Book does not exist!!" })

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ message: "please provide some data", error: "data can't be empty" })

        // taking reviews in string only
        if (data.review) {
            if (typeof data.review == 'number') return res.status(400).send({ status: false, message: "Review must in letters." })
        }
        console.log(typeof (data.review))

        //    current date of review 
        data["reviewedAt"] = Date.now()
        // reviewer name
        if (data.reviewedBy) {
            data["reviewedBy"] = data.reviewedBy
        }

        // if reviewer don't mention name then it will take by default: 'Guest'
        data["reviewedBy"]

        // taking rating
        if (!data.rating) return res.status(400).send({ status: false, message: "Rating should required, rating should be a number" })
        // condition for checking rating only in number
        if (typeof (data.rating) == "string") return res.status(400).send({ status: false, message: "rating should be a number" })
        // rating only b/w in 1 to 5
        if (data.rating < 1 || data.rating > 5) return res.status(400).send({ status: false, message: "Please provide rating in between 1 to 5" })

        data.bookId = bookId
        let createReview = await reviewModel.create(data)
        let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).count()

        // add(merge) reviewData key in book document
        book['reviewsData'] = createReview

        // update reviews count in book document after recieved review
        book['reviews'] = reviews

        res.status(201).send({ status: true, message: "Review created", data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })

    }
}

//________________________________________Update Reviews_________________________________________//

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter valid book id" })
        }

        // checking book is present in db or not
        let books = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!books) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        let reviewId = req.params.reviewId
        if (!isValidId(reviewId)) {
            return res.status(400).send({ status: false, msg: "Review Id is invalid" });
        }

        // checking review is present in db or not
        let review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        let data = req.body
        if (data.review || data.rating || data.reviewedBy) {
            let updateReviews = await reviewModel.findOneAndUpdate({ _id: reviewId, bookId: bookId }, { $set: data }, { new: true })
            let book = await booksModel.findOne({ _id: bookId, isDeleted: false }).lean()
            book['reviewsData'] = updateReviews
            return res.status(200).send({ status: true, data: book })
        }
        else {
            return res.status(400).send({ status: false, msg: "Body should not be empty !!" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })

    }
}

//______________________________Delete Reviews___________________________________//

const deleteReviewById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!isValidId(bookId)) {
            return res.status(400).send({ status: false, message: "Enter valid book id" })
        }

        let books = await booksModel.findOne({ _id: bookId, isDeleted: false })
        if (!books) {
            return res.status(404).send({ status: false, message: "Book not found" })
        }

        let reviewId = req.params.reviewId
        if (!isValidId(reviewId)) {
            return res.status(400).send({ status: false, msg: "Review Id is invalid" });
        }

        let review = await reviewModel.findOne({ _id: reviewId, isDeleted: false })
        if (!review) {
            return res.status(404).send({ status: false, message: "Review not found" })
        }

        let deletebooks = await reviewModel.findByIdAndUpdate(reviewId
            , { isDeleted: true, deletedAt: Date.now() }
            , { new: true })

        let updateBook = await booksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })

        res.status(200).send({ status: true, message: 'Review is deleted successfully' })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: "server Error", error: err.message })

    }
}

module.exports = { createReviews, updateReview, deleteReviewById }