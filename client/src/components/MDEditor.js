import React from "react";
import {Row, message} from "antd";
import FileOptions from "./FileOptions";
import MarkdownEditor from "@uiw/react-markdown-editor";
import './MDEditor.css'
import saveFile from "../utils/autoSaveUtil";
import socketIOClient from "socket.io-client";

const AUTO_SAVE_INTERVAL = 5000

class MDEditor extends React.Component {
    constructor(props) {
        super(props);
        this.filename = props.doc.filename
        this.markdown = props.doc.content
        this.lastSave = props.doc.lastEdited
        this.lastChange = props.doc.lastEdited
        this.lastAppliedChange = null
        this.init = true
        this.updateMarkdown = this.updateMarkdown.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.autoSave, AUTO_SAVE_INTERVAL)
        this.lastChange = new Date(this.props.doc.lastEdited)
        this.lastSave = new Date(this.props.doc.lastEdited)
        this.editor = this.refs.markdownInstance.CodeMirror.editor
        this.editor.doc.setValue(this.props.doc.content)
        this.initSocket()
    }

    initSocket = () => {
        this.socket = socketIOClient('http://localhost:8000', {query: 'fileId=' + this.props.doc._id})
        this.socket.on('msg', (msg) => {
            console.log(msg)
        })
        this.socket.on('change', (delta) => {
            const change = JSON.parse(delta)
            console.log(change)
            this.lastAppliedChange = delta
            this.editor.doc.replaceRange(change.replacement, change.from, change.to)
        })
    }

    autoSave = () => {
        if (this.lastChange.getTime() > this.lastSave.getTime()) {
            saveFile({
                id: this.props.doc._id,
                content: this.markdown,
                filename: this.filename
            }).then(res => {
                this.lastSave = new Date(res.data.doc.lastEdited)
            }).catch(e => {
                message.error(e)
            })
        } else {
            console.log("No change")
        }
    }

    updateMarkdown(editor, data, value) {
        if (!this.init) {
            this.lastChange = new Date()
            this.markdown = editor.doc.getValue()
            const delta = {
                replacement: data.text,
                from: data.from,
                to: data.to
            }
            const deltaStr = JSON.stringify(delta)
            if (this.lastAppliedChange !== deltaStr) {
                this.socket.emit('change', deltaStr)
            }
        } else {
            this.init = false
        }
    }

    setFilename = (filename) => {
        this.filename = filename
        console.log(filename)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        this.socket.disconnect()
    }

    render() {
        return (
            <div id='editor-div'>
                <Row id='editor-info-row'>
                    <div>
                        <FileOptions
                            setFilename={this.setFilename}
                            filename={this.filename}
                            fileId={this.props.doc._id}/>
                    </div>
                </Row>
                <MarkdownEditor
                    ref='markdownInstance'
                    onChange={this.updateMarkdown}
                    height={'calc(100vh - 200px)'}
                />
            </div>
        );
    }
}

export default MDEditor