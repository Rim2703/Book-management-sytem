const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const {isVAlidEmail,isValidPassword,isValidPhone,isValid} = require("../validator/validator")

const isValidreqbody = function (body) {
    return Object.keys(body).length > 0
}

const createUser = async function (req, res) {
    try {
        if (Object.keys(req.body).length == 0) return res.status(400).send({ message: "Please provide data", error: "body can't be empty" })

        let {title,name,phone,email,password} = req.body;
        
        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is required" })
        title= title.trim()
        if (!["Mr", "Miss", "Mrs"].includes(title)) return res.status(400).send({ status: false, message: "title must be Mr ,Mrs ,Miss" })

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is required , name must be string" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone number is required" })
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "enter valid number, number must in ten digit" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })
        if (!isVAlidEmail(email)) return res.status(400).send({ status: false, message: "Please provide the valid email address" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password must be in 8 to 15 & password must contain uppercase lowercase and one special character" })

        let phones = await userModel.findOne({ phone: phones })
        if (phone) return res.status(409).send({ status: false, message: "phone number is already exists" })

        let emails = await userModel.findOne({ email: emails })
        if (email) return res.status(409).send({ status: false, message: "email is already exists" })

        let userCreated = await userModel.create(user);
        res.status(201).send({ status: true, message: "Success", data: userCreated });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
};
//---------------------------------------LogIn-------------------------------------------------------//
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
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(401).send({ status: false, message: "email is not correct, Please provide valid email" });

        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }
        let pass = await userModel.findOne({ password: password });
        if (!pass) return res.status(401).send({ status: false, message: "password is not correct, Please provide valid password" });


        let token = jwt.sign(
            {
                userId: _id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            "Project3-Group24"
        );

        res.status(200).send({ status: true, message: "Success", token: token });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { userLogin, createUser }