const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const validation = require("../validator/validator")

const isValidreqbody = function (body) {
    return Object.keys(body).length > 0
}

const createUser = async function (req, res) {
    try {

        let user = req.body;
        if(!validation.isValid(user.title)) return res.status(400).send({status:false,message:"title is required"})
        if(!validation.isValid(user.name)) return res.status(400).send({status:false,message:"name is required"})
        if(!validation.isValid(user.phone)) return res.status(400).send({status:false,message:"phone number is required"})
        if(!validation.isValid(user.email)) return res.status(400).send({status:false,message:"email is required"})
        if(!validation.isValid(user.password)) return res.status(400).send({status:false,message:"password is required"})
        if (Object.keys(user).length == 0) return res.status(400).send({message: "please provide data", error: "body can't be empty" })
        if (!["Mr", "Miss", "Mrs"].includes(user.title)) return res.status(400).send({ status: false, message: "title must be Mr ,Mrs ,Miss" })
        if (!validation.isValid(user.name)) return res.status(400).send({ status: false, message: "name is require , name must be string" })
        if (!validation.isValidPhone(user.phone)) return res.status(400).send({ status: false, message: "enter valid number, number must in ten digit" })

        let phone = await userModel.findOne({ phone: user.phone })
        if (phone) return res.status(409).send({ status: false, message: "phone number is already exists" })

        if (!validation.isVAlidEmail(user.email)) return res.status(400).send({ status: false, message: "email is require, provide the valid email address" })
        let email = await userModel.findOne({ email: user.email })
        if (email) return res.status(409).send({ status: false, message: "email is already exists" })

        if (!validation.isValidPassword(user.password)) return res.status(400).send({ status: false, message: "password must be in 8 to 15 & password must contain uppercase lowercase and one special character" })

        let userCreated = await userModel.create(user);
        res.status(201).send({ status: true, message:"Success" ,data: userCreated });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        if (!isValidreqbody(data)) {
            return res.status(400).send({ statua: false, message: "Please provide login details!!" })
        }

        const { email, password } = data
        if (!(email)) {
            return res.status(400).send({ status: false, message: "Email is required!!" })
        }
        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send({ status: false, message: "email is not correct please provide valid email" });
        let pass = await userModel.findOne({password:password});
        if(!pass) return res.status(401).send({ status: false, message: "password is not correct please provide valid password" });


        let token = jwt.sign(
            {
                userId: user._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            "Project3-Group24"
        );

        res.status(200).send({ status: true, message:"Success", token: token });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { userLogin, createUser }