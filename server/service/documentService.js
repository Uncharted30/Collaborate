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

const createNewDocument = async (newDocument, userId) => {
    newDocument.createdBy = userId;
    newDocument.access.set(userId, 'edit');
    newDocument.lastEditedBy = userId;
    if (newDocument.type === 'code') {
        newDocument.content = CODE_DEFAULT
    } else if (newDocument.type === 'markdown') {
        newDocument.content = MD_DEFAULT
    }
    await newDocument.save()
    const user = await User.findById(userId)
    user.files.set(newDocument._id.toString(), newDocument.created)
    await user.save()
    return newDocument
}

const getDocumentsByUser = async userId => {
    const user = await User.findById(userId)
    let keys = [...user.files.keys()]
    const docs = await Document.find({
            '_id': {
                $in: keys
            }
        },
        'filename lastEdited type')
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
    return docInfo
}

const getDocumentById = async (docId, userId) => {
    const doc = await Document.findById(docId)
    if (doc.accessType.startsWith('public')) {
        return doc
    } else {
        const access = doc.access.get(userId)
        if (access) {
            doc.access = access
            try {
                const user = await User.findById(userId)
                user.files.set(doc._id.toString(), new Date())
                await user.save()
                return doc
            } catch (e) {
                throw "User nor found."
            }
        } else {
            throw "no_access"
        }
    }
}

const updateDocument = async (updateDoc, userId) => {
    const doc = await Document.findById(updateDoc.id)
    const access = doc.access.get(userId)
    if (doc.accessType === 'public-edit' || access === 'edit') {
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
        throw "no_access"
    }
}

const shareFile = () => {

}

const deleteDocument = async (docId, userId) => {
    const user = await User.findById(userId)
    if (user.files.get(docId)) {
        user.files.delete(docId)
        await user.save()
        // delete document if the document is created by the user
        const doc = await Document.findById(docId, '_id createdBy')
        if (doc.createdBy === userId) {
            await Document.deleteOne({_id: docId})
        }
    } else {
        throw "File is not in user's list."
    }
}

const makeCopy = async (docId, userId) => {
    const doc = await Document.findById(docId)
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
    await doc.save()
    const user = await User.findById(userId)
    user.files.set(doc._id.toString(), new Date())
    await user.save()
    return doc._id
}

module.exports = {
    createNewDocument,
    getDocumentsByUser,
    getDocumentById,
    updateDocument,
    deleteDocument,
    makeCopy
}