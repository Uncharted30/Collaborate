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
    let token = req.cookies['token']
    documentService.createNewDocument(newDocument, token).then((newDocument) => {
        res.send({
            status: 200,
            msg: 'succeed',
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
    let token = req.cookies['token']
    documentService.getDocumentsByUser(token).then(docInfo => {
        res.send({
            status: 200,
            msg: 'succeed',
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
    const token = req.cookies['token']
    const id = req.params.id
    documentService.getDocumentById(id, token).then((doc) => {
        res.send({
            status: 200,
            msg: 'succeed',
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
    const token = req.cookies['token']
    const id = req.body.id
    const content = req.body.content
    const filename = req.body.filename

    console.log(id)
    updateDoc = new Document({
        _id: id,
        content: content,
        filename: filename
    })

    console.log(updateDoc._id)
    documentService.updateDocument(updateDoc, token).then((doc) => {
        res.send({
            status: 200,
            msg: 'succeed',
            doc: doc
        })
    }).catch(e => {
        res.send({
            status: 200,
            msg: e,
        })
    })
})

module.exports = router