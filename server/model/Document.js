const mongoose = require('mongoose')

let DocumentSchema = mongoose.Schema({
    created: {
        type: Date,
        required: true,
        default: Date.now()
    },
    filename: {
        type: String,
        required: true,
        default: "Untitled"
    },
    lastEdited: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdBy: {
        type: String,
        required: true
    },
    lastEditedBy: {
        type: String,
        require: true
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['markdown', 'code'],
        required: true
    },
    access: {
        type: Map,
        of: String,
    }
});

let Document = mongoose.model("Document", DocumentSchema)

module.exports = Document