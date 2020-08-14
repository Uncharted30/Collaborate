const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require('dotenv').config()
const publicKey = process.env.PUBLIC_KEY
const User = require('../model/User')
const Document = require('../model/Document')

const MD_DEFAULT = '#This is an H1\n##This is an H2\n######This is an H6';
const CODE_DEFAULT = 'public class Example {' +
    '\n\tpublic static void main(String[] args) {' +
    '\n\t\tSystem.out.println("Hello World!");' +
    '\n\t}' +
    '\n}';

const createNewDocument = (newDocument, token) => {
    return new Promise((resolve, reject) => {
        let decoded;
        try {
            decoded = jwt.verify(token, publicKey);
        } catch (e) {
            reject("Unauthorized.")
            return
        }
        let userId = decoded.id;
        newDocument.createdBy = userId;
        newDocument.access.set(userId, 'edit');
        newDocument.lastEditedBy = userId;
        if (newDocument.type === 'code') {
            newDocument.content = CODE_DEFAULT
        } else if (newDocument.type === 'markdown') {
            newDocument.content = MD_DEFAULT
        }
        newDocument.save((err) => {
            if (err) {
                reject("Wrong creating new file. " + err)
            } else {
                resolve(newDocument)
                User.findById(userId, (err, user) => {
                    if (!err && user) {
                        console.log(user)
                        user.files.set(newDocument._id.toString(), newDocument.created)
                        user.save()
                    } else {
                        reject('User not found!')
                    }
                })
            }
        });
    });
}

const getDocumentsByUser = (token) => {
    return new Promise((resolve, reject) => {
        let decoded;
        try {
            decoded = jwt.verify(token, publicKey);
            User.findById(decoded.id, (err, user) => {
                if (!err && user) {
                    let keys = [...user.files.keys()]
                    Document.find({
                        '_id': {
                            $in: keys
                        }
                    }, 'filename lastEdited type',(err, docs) => {
                        if (!err && docs) {
                            let docInfo = []
                            docs.forEach(doc => {
                                docInfo.push({
                                    id: doc._id,
                                    filename: doc.filename,
                                    lastEdited: doc.lastEdited,
                                    type: doc.type,
                                    lastOpened: user.files.get(doc._id)
                                })
                            })
                            resolve(docInfo)
                        } else {
                            reject("Error retrieving documents.")
                        }
                    })
                } else {
                    reject("User not found!");
                }
            })

        } catch (e) {
            reject("Unauthorized.")
        }
    })
}

module.exports = {
    createNewDocument, getDocumentsByUser
}