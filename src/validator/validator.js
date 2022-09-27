const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length > 0) return true;
    return false;
}

const isValidId = function (Id) {
    if (!mongoose.Types.ObjectId.isValid(Id)) {
        return false
    }
    return (true)
}

//------------------------------- password regex ------------------------------------------//

const isValidPassword = function (password) {
    return (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(password))
}

//------------------------------- email regex --------------------------------------------//

const isVAlidEmail = function (email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)
}

//------------------------------- phone regex --------------------------------------------//

const isValidPhone = function (phone) {
    return (/^[6789]\d{9}$/).test(phone)

}
//-------------------------------- ISBN regex --------------------------------------------//

const isValidIsbn = function (ISBN) {
    return (/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/).test(ISBN)
}

//-------------------------------- Date regex --------------------------------------------//

const isValidDate = function (date) {
    // return (/^\d{4}-\d{2}-\d{2}$/).test(date)
    return (/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/).test(date)
}

module.exports = { isValid, isVAlidEmail, isValidPassword, isValidPhone, isValidIsbn, isValidId, isValidDate }