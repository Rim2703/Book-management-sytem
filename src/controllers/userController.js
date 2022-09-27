const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")
const { isVAlidEmail, isValidPassword, isValidPhone, isValid } = require("../validator/validator")

const isValidreqbody = function (body) {
    return Object.keys(body).length > 0
}

//___________________________________________ Create User _________________________________________________________//


const createUser = async function (req, res) {
    try {
        let user = req.body
        if (Object.keys(user).length == 0) return res.status(400).send({ message: "Please provide data", error: "body can't be empty" })

        // using destructuring for fields
        let { title, name, phone, email, password } = user;

        if (!isValid(title)) return res.status(400).send({ status: false, message: "title is required" })
        // validation for title
        if (!["Mr", "Miss", "Mrs"].includes(title)) return res.status(400).send({ status: false, message: "title must be Mr ,Mrs ,Miss" })

        if (!isValid(name)) return res.status(400).send({ status: false, message: "Name is required , name must be string" })

        if (!isValid(phone)) return res.status(400).send({ status: false, message: "Phone number is required" })

        // validation for phone number
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: "Enter valid number, number must in ten digit" })

        //    db call for checking duplicate number exists 
        let phones = await userModel.findOne({ phone: phone })
        if (phones) return res.status(409).send({ status: false, message: "Phone number is already exists" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is required" })

        //    validation for email
        if (!isVAlidEmail(email)) return res.status(400).send({ status: false, message: "Please provide the valid email address" })

        //    db call for checking duplicate email exists
        let emails = await userModel.findOne({ email: email })
        if (emails) return res.status(409).send({ status: false, message: "email is already exists" })

        if (!isValid(password)) return res.status(400).send({ status: false, message: "Password is required" })

        // validation for password
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "password must be in 8 to 15 & password must contain uppercase lowercase and one special character" })

        if (typeof (user.address) !== "object") return res.status(400).send({ status: false, message: "address should be in object format" })

        // creating user
        let userCreated = await userModel.create(user);
        res.status(201).send({ status: true, message: "Success", data: userCreated });
    } catch (err) {
        res.status(500).send({ status: false, error: err.message });
    }
}
//_____________________________________________ Login ___________________________________________________________//

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

        // check email for user
        let user = await userModel.findOne({ email: email });
        if (!user) return res.status(400).send({ status: false, message: "Email is not correct, Please provide valid email" });

        if (!(password)) {
            return res.status(400).send({ status: false, message: "Password is required!!" })
        }

        // check password of existing user
        let pass = await userModel.findOne({ password: password });
        if (!pass) return res.status(400).send({ status: false, message: "Password is not correct, Please provide valid password" });

        let userid = await userModel.findOne({ email: email, password: password })

        // using jwt for creating token
        let token = jwt.sign(
            {
                userId: userid._id.toString(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            },
            "Project3-Group24"
        );

        res.status(201).send({ status: true, message: "Success", data: token });
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message });
    }
}

module.exports = { createUser, userLogin }