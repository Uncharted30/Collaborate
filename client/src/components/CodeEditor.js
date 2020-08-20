import React from 'react';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-swift";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-eclipse";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-monokai";
import './CodeEditor.css'
import {message, Row} from "antd";
import {Divider} from "@material-ui/core";
import CodeSelector from "./CodeSelector";
import ThemeSelector from "./ThemeSelector";
import FileOptions from "./FileOptions";
import socketIOClient from "socket.io-client";
import {saveFile} from "../utils/fileUtils";
import {formatDateWithSeconds} from "../utils/utils";
import {connect} from 'react-redux';
import {setCleanupFunction} from "../actions";

const AUTO_SAVE_INTERVAL = 5000

class CodeEditor extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.state = {
            mode: 'java',
            theme: 'github',
            editAccess: false,
            lastSave: new Date(props.doc.lastEdited),
        }
        this.filename = props.doc.filename
        this.content = props.doc.content
        this.lastChange = new Date(props.doc.lastEdited)
        this.lastAppliedChange = null
    }

    initSocket = () => {
        this.socket = socketIOClient('http://localhost:8000', {query: 'fileId=' + this.props.doc._id})
        this.socket.on('msg', (msg) => {
            console.log(msg)
        })
        this.socket.on('change', (delta) => {
            const change = JSON.parse(delta)
            this.lastAppliedChange = change
            this.editor.getSession().getDocument().applyDeltas([change])
        })
    }

    onChange(newValue) {
        this.content = newValue
        this.lastChange = new Date()
        // console.log(newValue)
    }

    setFilename = (filename) => {
        this.filename = filename
        this.lastChange = new Date()
    }

    changeMode = (mode) => {
        this.setState({
            mode: mode
        })
    }

    changeTheme = (theme) => {
        this.setState({
            theme: theme
        })
    }

    componentDidMount() {
        this.interval = setInterval(this.autoSave, AUTO_SAVE_INTERVAL)
        this.initSocket()
        let editAccess = false
        if (this.props.doc.accessType === 'public-edit') editAccess = true
        else if (this.props.doc.accessType === 'public-read' && this.props.userId === this.props.doc.createdBy) editAccess = true
        else if (this.props.doc.accessType === 'controlled' && this.props.access === 'edit') editAccess = true
        if (editAccess) {
            this.interval = setInterval(this.autoSave, AUTO_SAVE_INTERVAL)
        }
        this.setState({
            editAccess: editAccess
        })
        this.editor.setReadOnly(!editAccess)
        this.editor.on('change', e => {
            if (this.lastAppliedChange !== e) {
                this.socket.emit('change', JSON.stringify(e))
            }
        })
        this.props.setCleanupFunction(this.cleanup)
    }

    cleanup = async () => {
        clearInterval(this.interval)
        if (this.state.editAccess) await saveFile({
            id: this.props.doc._id,
            content: this.content,
            filename: this.filename
        }).catch(e => {
            message.error(e)
        })
        this.socket.emit('disconnect', 'disconnect')
        this.socket.disconnect()
        this.cleaned = true
        this.props.setCleanupFunction(async () => {})
    }

    componentWillUnmount() {
        if (!this.cleaned) this.cleanup()
    }

    autoSave = () => {
        if (this.lastChange.getTime() > this.state.lastSave.getTime()) {
            saveFile({
                id: this.props.doc._id,
                content: this.content,
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

    setEditor = (editor) => {
        this.editor = editor
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
                    <div className='editor-info-div'>
                        <ThemeSelector changeTheme={this.changeTheme}/>
                        <Divider orientation="vertical" flexItem style={{height:39}}/>
                        <CodeSelector changeMode={this.changeMode}/>
                    </div>
                </Row>
                <Row className='save-time-access-info'>
                    <span>Last save: {formatDateWithSeconds(this.state.lastSave)}</span>
                    <span>{this.state.editAccess ? '' : 'Read only'}</span>
                </Row>
                <AceEditor
                    mode={this.state.mode}
                    theme={this.state.theme}
                    onChange={this.onChange}
                    defaultValue={this.content}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    width='100%'
                    className='ace-editor'
                    onLoad={this.setEditor}
                />
            </div>
        );
    }
}

export default connect(null, {setCleanupFunction})(CodeEditor)
