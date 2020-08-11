const User = require("../model/User")
const bcrypt = require("bcrypt");

const saltRounds = 10

let createUser = function (user) {
    return new Promise((resolve, reject) => {
        User.findOne({email: user.email}, function (err, dbUser) {
            if (dbUser) {
                reject("User exists.")
            } else {
                bcrypt.hash(user.password, saltRounds, (err, hash) => {
                    if (err) {
                        reject("Error creating new user.")
                    } else {
                        user.password = hash
                        user.save(function (err) {
                            if (err) {
                                reject("Error creating new user.")
                            }
                        })
                        resolve(user)
                    }
                })
            }
        })
    })
}

module.exports = {
    createUser: createUser,
}