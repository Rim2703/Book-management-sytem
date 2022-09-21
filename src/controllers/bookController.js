const bookModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const validation = require("../validator/validator")


//________________ Create Books ___________________//


const createBooks = async function (req,res) {
  try{
       let books = req.body
       let validUserId = books.userId

       if(Object.keys(books).length == 0) return res.status(400).send({message: "please provide some data",error: "data can't be empty"})
       
       if(!validation.isValid(books.title)) return res.status(400).send({status:false , message:"Title is required ,title should be in string"})
       let validtitle = await bookModel.findOne({title:books.title})
       if(validtitle) return  res.status(400).send({status:false , message:"Title is already exists"})
       
       if(!validation.isValid(books.excerpt)) return res.status(400).send({status:false , message:"Excerpt is required ,excerpt should be in string"})
      
       if(!validUserId) return res.status(400).send({status:false , message:"userId is required"})
       let checkuserId = await userModel.findById(validUserId)
       if(checkuserId == undefined) return res.status(404).send({status:false , message:"User is not found"})
       
       if(!validation.isValid(books.ISBN)) return res.status(400).send({status:false , message:"ISBN is required ,ISBN should be in string"})
       if(!validation.isValidIsbn(books.ISBN)) return res.status(400).send({status:false,message:"ISBN is not valid"})
       let validISBN = await bookModel.findOne({ISBN:books.ISBN})
       if (validISBN) return res.status(400).send({status:false,message:"ISBN is already exists"})

       if(!validation.isValid(books.category)) return res.status(400).send({status:false , message:"category is required ,category should be in string"})
       
       if(!validation.isValid(books.subcategory)) return res.status(400).send({status:false , message:"Subcategory is required ,Subcategory should be in string"})
       
       if(!validation.isValid(books.releasedAt)) return res.status(400).send({status:false, message: "ReleasedAt should required, releaseAt should be in Date"})
      
       
        let bookcreate = await bookModel.create(books)
        res.status(201).send({status:true , message:"Success", data:bookcreate})
       
      
    }catch(err){
        res.status(500).send({status:false,message:"Server Error",error:err.message})
    }
 }

 module.exports.createBooks = createBooks