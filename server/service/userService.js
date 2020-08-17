const User = require("../model/User")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const publicKey = process.env.PUBLIC_KEY
const privateKey = process.env.PRIVATE_KEY

const saltRounds = 10

let createUser = async user => {
    user.email = user.email.toLowerCase()
    const dbUser = await User.findOne({email: user.email})
    if (dbUser) {
        throw "User exists."
    } else {
        user.password = await bcrypt.hash(user.password, saltRounds)
        user.save()
        let token = jwt.sign({
            email: user.email,
            id: user._id
        }, privateKey, {algorithm: 'RS256', expiresIn: '30d'})
        return token
    }
}

let updateUser = async (user, token) => {
    try {
        jwt.verify(token, publicKey)
    } catch (err) {
        throw "Unauthorized"
    }

    const dbUser = await User.findOne({email: user.email})
    if (user.password) {
        dbUser.password = bcrypt.hash(user.password, saltRounds)
    }
    dbUser.firstName = user.firstName
    dbUser.lastName = user.lastName
    dbUser.save()
}

let userSignIn = async user => {
    user.email = user.email.toLowerCase()
    const dbUser = await User.findOne({email: user.email})
    const res = await bcrypt.compare(user.password, dbUser.password)
    if (res) {
        let token = jwt.sign({
            email: dbUser.email,
            id: dbUser._id
        }, privateKey, {algorithm: 'RS256', expiresIn: '30d'})
        return token
    } else {
        throw "Incorrect email or password."
    }
}

let getUserInfo = async token => {
    try {
        let decoded = jwt.verify(token, publicKey)
        return await User.findById({
            email: decoded.id
        })
    } catch {
        throw "Unauthorized"
    }
}

module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    userSignIn: userSignIn,
    getUserInfo: getUserInfo
}