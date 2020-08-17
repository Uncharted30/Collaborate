require('dotenv').config()
const User = require('../model/User')
const Document = require('../model/Document')
const mongoose = require('mongoose')

const MD_DEFAULT = '# This is an H1\n## This is an H2\n###### This is an H6';
const CODE_DEFAULT = 'public class Example {' +
    '\n\tpublic static void main(String[] args) {' +
    '\n\t\tSystem.out.println("Hello World!");' +
    '\n\t}' +
    '\n}';

const createNewDocument = (newDocument, userId) => {
    return new Promise((resolve, reject) => {
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

const getDocumentsByUser = (userId) => {
    return new Promise((resolve, reject) => {
        console.log(userId)
        User.findById(userId, (err, user) => {
            if (!err && user) {
                let keys = [...user.files.keys()]
                Document.find({
                    '_id': {
                        $in: keys
                    }
                }, 'filename lastEdited type', (err, docs) => {
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
    })
}

const getDocumentById = (docId, userId) => {
    return new Promise((resolve, reject) => {
        Document.findById(docId, (err, doc) => {
                if (!err && doc) {
                    if (doc.accessType.startsWith('public')) {
                        resolve(doc)
                    } else {
                        const access = doc.access.get(userId)
                        if (access) {
                            doc.access = access
                            User.findById(userId, (err, user) => {
                                if (!err && user) {
                                    user.files.set(doc._id.toString(), new Date())
                                    user.save((err) => {
                                        resolve(doc)
                                    })
                                } else {
                                    reject('User not found.')
                                }
                            })
                        } else {
                            reject("no_access")
                        }
                    }
                } else {
                    reject("File not found.")
                }
            }
        )
    })
}

const updateDocument = (updateDoc, userId) => {
    return new Promise((resolve, reject) => {
        Document.findById(updateDoc.id, (err, doc) => {
                if (!err && doc) {
                    const access = doc.access.get(userId)
                    if (doc.accessType === 'public-edit' || access === 'edit') {
                        doc.content = updateDoc.content
                        doc.filename = updateDoc.filename
                        doc.lastEdited = Date.now()
                        doc.lastEditedBy = userId
                        doc.save(err => {
                            if (err) {
                                reject("Error saving file. Please try again later.")
                            } else {
                                resolve({
                                    lastEdited: doc.lastEdited,
                                    lastEditedBy: doc.lastEditedBy
                                })
                            }
                        })
                    } else {
                        reject("no_access")
                    }
                } else {
                    reject("File not found.")
                }
            }
        )
    })
}

const shareFile = () => {

}

const deleteDocument = (docId, userId) => {
    return new Promise((resolve, reject) => {
        User.findById(userId, (err, user) => {
            if (!err && user) {
                if (user.files.get(docId)) {
                    user.files.delete(docId)
                    user.save(err => {
                        if (!err) {
                            // delete document if the document is created by the user
                            Document.findById(docId, '_id createdBy', (err, doc) => {
                                if (!err && doc) {
                                    if (doc.createdBy === userId) {
                                        Document.deleteOne({_id: docId}, err => {
                                            if (err) {
                                                reject(err)
                                            } else {
                                                resolve()
                                            }
                                        })
                                    } else resolve()
                                } else {
                                    reject('File not found.')
                                }
                            })
                        } else {
                            reject('Error deleting file. ' + err)
                        }
                    })
                } else {
                    reject("File is not in user's list.")
                }
            } else {
                reject('User not found.')
            }
        })
    })
}

const makeCopy = (docId, userId) => {
    return new Promise((resolve, reject) => {
        Document.findById(docId, (err, doc) => {
            if (!err && doc) {
                // create a new document object in database
                // only the creator has access
                doc._id = mongoose.Types.ObjectId()
                doc.isNew = true
                doc.created = new Date()
                doc.filename = doc.filename + "_copy"
                doc.lastEdited = new Date()
                doc.createdBy = userId
                doc.lastEditedBy = userId
                doc.accessType = 'controlled'
                doc.access = new Map()
                doc.access.set(userId, 'edit')
                doc.save(err => {
                    if (!err) {
                        User.findById(userId, (err, user) => {
                            if (!err && user) {
                                user.files.set(doc._id, new Date())
                                user.save
                            } else {
                                reject('User not found')
                            }
                        })
                    } else {
                        reject("Error creating a copy of the file. " + err)
                    }
                })
            } else {
                reject('File not found.')
            }
        })
    })
}

module.exports = {
    createNewDocument,
    getDocumentsByUser,
    getDocumentById,
    updateDocument,
    deleteDocument,
    makeCopy
}