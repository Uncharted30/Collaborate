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
        throw new Error("User exists.")
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
    let decoded
    try {
        decoded = jwt.verify(token, publicKey)
    } catch (err) {
        throw new Error("Unauthorized")
    }

    const dbUser = await User.findById(decoded.id)
    if (!dbUser) throw new Error("User not found.")

    if (user.password !== '') {
        dbUser.password = await bcrypt.hash(user.password, saltRounds)
    }
    if (user.firstName !== '') dbUser.firstName = user.firstName
    if (user.lastName !== '') dbUser.lastName = user.lastName
    await dbUser.save()
}

let userSignIn = async user => {
    user.email = user.email.toLowerCase()
    const dbUser = await User.findOne({email: user.email})
    if (!dbUser) {
        throw new Error("Incorrect email or password.")
    }
    const res = await bcrypt.compare(user.password, dbUser.password)
    if (res) {
        const token = jwt.sign({
            email: dbUser.email,
            id: dbUser._id
        }, privateKey, {algorithm: 'RS256', expiresIn: '30d'})
        return token
    } else {
        throw new Error("Incorrect email or password.")
    }
}

let getUserInfo = async token => {
    let decoded
    try {
        decoded = jwt.verify(token, publicKey)
    } catch {
        throw new Error("Unauthorized")
    }
    const user =  await User.findById(decoded.id)
    if (!user) {
        throw new Error("User not found.")
    }
    user.password = null
    return user
}

module.exports = {
    createUser: createUser,
    updateUser: updateUser,
    userSignIn: userSignIn,
    getUserInfo: getUserInfo,
}