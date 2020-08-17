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
    documentService.createNewDocument(newDocument, req.userId).then((newDocument) => {
        res.send({
            status: 200,
            msg: 'success',
            id: newDocument._id
        })
    }).catch((e) => {
        res.send({
            status: 200,
            msg: e
        })
    })
})

router.get('/list', (req, res) => {
    documentService.getDocumentsByUser(req.userId).then(docInfo => {
        res.send({
            status: 200,
            msg: 'success',
            docs: docInfo
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e
        })
    })
})

router.get('/one/:id', (req, res) => {
    const docId = req.params.id
    documentService.getDocumentById(docId, req.userId).then((doc) => {
        res.send({
            status: 200,
            msg: 'success',
            doc: doc
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e
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
            msg: e,
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
            msg: e
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
            msg: e
        })
    })
})

module.exports = router