const User = require("../model/User")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const privateKey = process.env.PRIVATE_KEY
const publicKey = process.env.PUBLIC_KEY

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

let updateUser = function(user, token) {
    return new Promise((resolve, reject) => {

        try {
            jwt.verify(token, publicKey);
        } catch (err) {
            reject("Not authorized!");
        }

        User.findOne({email: user.email}, function (err, dbUser) {
            if (dbUser) {
                bcrypt.hash(user.password, saltRounds, (err, hash) => {
                    if (err) {
                        reject("Error updating user information.")
                    } else {
                        dbUser.password = hash
                        dbUser.firstName = user.firstName
                        dbUser.lastName = user.lastName
                        dbUser.save(function (err) {
                            if (err) {
                                reject("Error updating user information.")
                            }
                        })
                        resolve(dbUser)
                    }
                })
            } else {
                reject("User not found.")
            }
        })
    })
}

let userSignIn = (user) => {
    return new Promise((resolve, reject) => {
        User.findOne({email: user.email}, function (err, dbUser) {
            if (dbUser) {
                bcrypt.compare(user.password, dbUser.password, (err, result) => {
                    if (err) {
                        reject("Error signing you in.")
                    } else {
                        if (result) {
                            console.log(privateKey)
                            let token = jwt.sign({
                                username: user.username
                            }, privateKey, { algorithm: 'RS256', expiresIn: '30d'})
                            resolve(token)
                        } else {
                            reject("Incorrect email or password.")
                        }
                    }
                })
            } else {
                reject("Incorrect email or password.")
            }
        })
    })
}

module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    userSignIn: userSignIn
}