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

const createNewDocument = async (newDocument, userId, userEmail) => {
    newDocument.createdBy = userId;
    newDocument.access.set(userId, {
        email: userEmail,
        access: 'edit'
    });
    newDocument.lastEditedBy = userId;
    if (newDocument.type === 'code') {
        newDocument.content = CODE_DEFAULT
    } else if (newDocument.type === 'markdown') {
        newDocument.content = MD_DEFAULT
    }
    const user = await User.findById(userId)
    if (!user) throw new Error("File not found.")
    user.files.set(newDocument._id.toString(), newDocument.created)
    await newDocument.save()
    await user.save()
    return newDocument
}

const getDocumentsByUser = async userId => {
    const user = await User.findById(userId)
    if (!user) throw new Error("File not found.")
    let keys = [...user.files.keys()]
    const docs = await Document.find({
            '_id': {
                $in: keys
            }
        },
        'filename lastEdited type createdBy')
    let docInfo = []
    docs.forEach(doc => {
        docInfo.push({
            id: doc._id,
            filename: doc.filename,
            lastEdited: doc.lastEdited,
            type: doc.type,
            createdBy: doc.createdBy,
            lastOpened: user.files.get(doc._id.toString())
        })
    })
    return docInfo
}

const getDocumentById = async (docId, userId) => {
    const doc = await Document.findById(docId)
    if (!doc) throw new Error("File not found.")
    if (doc.accessType.startsWith('public')) {
        return doc
    } else {
        const access = doc.access.get(userId)
        if (access) {
            const user = await User.findById(userId)
            if (!user) {
                throw new Error("User nor found.")
            }
            user.files.set(doc._id.toString(), new Date())
            await user.save()
            return doc
        } else {
            throw new Error("no_access")
        }
    }
}

const updateDocument = async (updateDoc, userId) => {
    const doc = await Document.findById(updateDoc.id)
    if (!doc) throw new Error("File not found.")
    const access = doc.access.get(userId)
    if (doc.accessType === 'public-edit' || access.access === 'edit') {
        doc.content = updateDoc.content
        doc.filename = updateDoc.filename
        doc.lastEdited = Date.now()
        doc.lastEditedBy = userId
        await doc.save()
        return ({
            lastEdited: doc.lastEdited,
            lastEditedBy: doc.lastEditedBy
        })
    } else {
        throw new Error("no_access")
    }
}

const deleteDocument = async (docId, userId) => {
    const user = await User.findById(userId)
    if (!user) throw new Error("User not found.")
    if (user.files.get(docId)) {
        user.files.delete(docId)
        await user.save()
        // delete document if the document is created by the user
        const doc = await Document.findById(docId, '_id createdBy')
        if (doc.createdBy === userId) {
            await Document.deleteOne({_id: docId})
        }
    } else {
        throw new Error("File is not in user's list.")
    }
}

const makeCopy = async (docId, userId) => {
    const doc = await Document.findById(docId)
    if (!doc) throw new Error("File not found.")
    doc._id = mongoose.Types.ObjectId()
    doc.isNew = true
    doc.created = new Date()
    doc.filename = doc.filename + "_copy"
    doc.lastEdited = new Date()
    doc.createdBy = userId
    doc.lastEditedBy = userId
    doc.accessType = 'controlled'
    doc.access = new Map()

    const user = await User.findById(userId)
    if (!user) throw new Error("User not found.")
    doc.access.set(userId, {access: 'edit', email:user.email})
    user.files.set(doc._id.toString(), new Date())
    await doc.save()
    await user.save()
    return doc._id
}

const changeAccessType = async (newAccessType, docId, userId) => {
    const doc = await Document.findById(docId)
    if (!doc) throw new Error("File not found.")
    if (doc.createdBy !== userId) {
        throw new Error('You have no access to change access type.')
    }

    doc.accessType = newAccessType
    await doc.save()
}

const addAccess = async (addUserEmail, docId, requestUserId, access) => {
    const doc = await Document.findById(docId)
    if (requestUserId !== doc.createdBy) {
        throw new Error('You could not modify the access list of this file.')
    }

    if (!doc) {
        throw new Error("File not found.")
    }

    addUserEmail = addUserEmail.toLowerCase()
    let addUser = await User.findOne({email: addUserEmail})
    if (!addUser) {
        throw new Error("User not found, please check the email address you entered.")
    }

    if (doc.createdBy === addUser._id.toString()) {
        throw new Error("Can not change access of the creator.")
    }

    doc.access.set(addUser._id.toString(), {email: addUser.email, access: access})
    await doc.save()
}

const removeAccess = async (docId, removeUserId, requestUserId) => {
    const doc = await Document.findById(docId)

    if (!doc) {
        throw new Error("File not found.")
    }

    if (requestUserId !== doc.createdBy) {
        throw new Error('You could not modify access list to this file.')
    }

    if (doc.createdBy === removeUserId.id) {
        throw new Error("Can not change access of the creator.")
    }

    doc.access.delete(removeUserId.id)
    await doc.save()
}

module.exports = {
    createNewDocument,
    getDocumentsByUser,
    getDocumentById,
    updateDocument,
    deleteDocument,
    makeCopy,
    changeAccessType,
    addAccess,
    removeAccess
}