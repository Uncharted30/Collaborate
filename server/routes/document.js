const express = require('express');
const router = express.Router();
const documentService = require('../service/documentService')
const Document = require('../model/Document')
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const cookieParser = require('cookie-parser')

router.use(jsonParser)
router.use(cookieParser())

router.post('/new', (req, res) => {
    let newDocument = new Document({
        type: req.body.type,
        access: {}
    })
    documentService.createNewDocument(newDocument, req.userId, req.userEmail).then((newDocument) => {
        res.send({
            status: 200,
            msg: 'success',
            id: newDocument._id
        })
    }).catch((e) => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.get('/list', (req, res) => {
    documentService.getDocumentsByUser(req.userId).then(docInfo => {
        res.send({
            status: 200,
            msg: 'success',
            docs: docInfo,
            userId: req.userId
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.get('/one/:id', (req, res) => {
    const docId = req.params.id
    documentService.getDocumentById(docId, req.userId).then((doc) => {
        res.send({
            status: 200,
            msg: 'success',
            doc: doc,
            userId: req.userId
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/', (req, res) => {
    const id = req.body.id
    const content = req.body.content
    const filename = req.body.filename

    updateDoc = new Document({
        _id: id,
        content: content,
        filename: filename
    })

    documentService.updateDocument(updateDoc, req.userId).then((doc) => {
        res.send({
            status: 200,
            msg: 'success',
            doc: doc
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.delete('/:id', (req, res) => {
    const docId = req.params.id
    const userId = req.userId
    console.log(userId)
    documentService.deleteDocument(docId, userId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.post('/copy', (req, res) => {
    const docId = req.body.id
    const userId = req.userId

    documentService.makeCopy(docId, userId).then(newId => {
        res.send({
            status: 200,
            msg: 'success',
            id: newId
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/accessType', (req, res) => {
    const docId = req.body.id
    const userId = req.userId
    const newAccessType = req.body.accessType

    documentService.changeAccessType(newAccessType, docId, userId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/access/add', (req, res) => {
    const docId = req.body.docId
    const requestUserId = req.userId
    const addUserEmail = req.body.userEmail
    const access = req.body.access

    documentService.addAccess(addUserEmail, docId, requestUserId, access).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

router.put('/access/remove', (req, res) => {
    const docId = req.body.docId
    const requestUserId = req.userId
    const removeUserId = req.body.userId

    documentService.removeAccess(docId, removeUserId, requestUserId).then(() => {
        res.send({
            status: 200,
            msg: 'success'
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e.message
        })
    })
})

module.exports = router