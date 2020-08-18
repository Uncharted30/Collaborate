import React from "react";
import {Row, message} from "antd";
import FileOptions from "./FileOptions";
import MarkdownEditor from "@uiw/react-markdown-editor";
import './MDEditor.css'
import {saveFile} from "../utils/fileUtils";
import socketIOClient from "socket.io-client";
import {formatDateWithSeconds} from "../utils/utils";

const AUTO_SAVE_INTERVAL = 5000

class MDEditor extends React.Component {
    constructor(props) {
        super(props);
        this.filename = props.doc.filename
        this.markdown = props.doc.content
        this.lastChange = new Date(this.props.doc.lastEdited)
        this.state = {
            lastSave: new Date(this.props.doc.lastEdited),
            editAccess: false
        }
        this.lastAppliedChange = null
        this.init = true
        this.updateMarkdown = this.updateMarkdown.bind(this);
    }

    componentDidMount() {
        this.editor = this.refs.markdownInstance.CodeMirror.editor
        this.editor.doc.setValue(this.props.doc.content)
        const editAccess = this.props.doc.accessType === 'public-edit' || this.props.userId === this.props.doc.createdBy
        if (editAccess) {
            this.setState({editAccess: true})
            this.interval = setInterval(this.autoSave, AUTO_SAVE_INTERVAL)
        }
        this.editor.setOption('readOnly', !editAccess)
        this.initSocket()
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if (nextProps.access !== this.props.access) {
            if (nextProps.doc.accessType === 'controlled') {
                if (nextProps.access === 'edit') {
                    this.setState({editAccess: true})
                    this.editor.setOption('readOnly', false)
                    if (!this.interval) this.interval = setInterval(this.autoSave, AUTO_SAVE_INTERVAL)
                } else {
                    this.editor.setOption('readOnly', true)
                    if (this.interval) clearInterval(this.interval)
                }
            }
        }
        return true
    }

    initSocket = () => {
        this.socket = socketIOClient('http://localhost:8000', {query: 'fileId=' + this.props.doc._id})
        this.socket.on('msg', (msg) => {
            // console.log(msg)
        })
        this.socket.on('change', (delta) => {
            const change = JSON.parse(delta)
            this.lastAppliedChange = delta
            this.editor.doc.replaceRange(change.replacement, change.from, change.to)
        })
    }

    autoSave = () => {
        if (this.lastChange.getTime() > this.state.lastSave.getTime()) {
            saveFile({
                id: this.props.doc._id,
                content: this.markdown,
                filename: this.filename
            }).then(res => {
                this.setState({
                    lastSave: new Date(res.data.doc.lastEdited)
                })
            }).catch(e => {
                message.error(e)
            })
        } else {
            // console.log("No change")
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
        this.lastChange = new Date()
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        saveFile({
            id: this.props.doc._id,
            content: this.markdown,
            filename: this.filename
        }).catch(e => {
            message.error(e)
        })
        this.socket.emit('disconnect', 'disconnect')
        this.socket.disconnect()
    }

    render() {
        return (
            <div id='editor-div'>
                <Row id='editor-info-row'>
                    <div>
                        <FileOptions
                            setFilename={this.setFilename}
                            doc={this.props.doc}
                            fetchFile={this.props.fetchFile}/>
                    </div>
                </Row>
                <Row className='save-time-access-info'>
                    <span>Last save: {formatDateWithSeconds(this.state.lastSave)}</span>
                    <span>{this.state.editAccess ? '' : 'Read only'}</span>
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