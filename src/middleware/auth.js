const jwt = require('jsonwebtoken')
const bookModel = require('../models/booksModel')


//_________________________________ authontication ____________________________________________//

const authentication = async function(req,res,next){
   try {
        let token = req.headers["x-api-key"];
        if (!token) 
        token = req.headers["X-API-KEY"];
        if (!token) {
            return res.status(401).send({ status: false, msg: "token must be present" })
        }

        let decodedToken = jwt.verify(token,"Project3-Group24")
        if (!decodedToken) {
            res.status(400).send({ status: false, msg: "invalid token" });
          }
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

//____________________________________ authorization __________________________________________________________//

const authorization = async function(req, res, next){
    try {
      let token = req.headers["x-auth-token"];
      let decodedToken = jwt.verify(token, "secret key");
      if (!decodedToken) {
        res.status(400).send({ status: false, message: "invalid user" });
      }
      let bookId = req.params.bookId;
      let findBooks= await bookModel.findOne({_id:bookId})
      if (!findBooks) {
          return res.status(400).send({ status: false, message: "books are not find" });
        }
        let authorId = findBooks.userId.toString()
      let validLoggedIn = decodedToken.userId;
      if (authorId !== validLoggedIn) {
        return res.status(400).send({ status: false, message: "Not a valid user" });
      }
      next();
    } catch (err) {
      res.status(400).send({ status: false, error: err.message });
    }
  }
  
module.exports = {authentication,authorization}