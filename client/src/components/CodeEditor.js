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
import {Row} from "antd";
import {Divider} from "@material-ui/core";
import CodeSelector from "./CodeSelector";
import ThemeSelector from "./ThemeSelector";
import FileOptions from "./FileOptions";
import socketIOClient from "socket.io-client";
import {saveFile} from "../utils/fileUtils";

const AUTO_SAVE_INTERVAL = 5000

class CodeEditor extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.state = {
            mode: 'java',
            theme: 'github'
        }
        this.filename = props.doc.filename
        this.content = props.doc.content
        this.lastSave = props.doc.lastEdited
        this.lastChange = props.doc.lastEdited
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
        console.log(newValue)
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
        this.lastChange = new Date(this.props.doc.lastEdited)
        this.lastSave = new Date(this.props.doc.lastEdited)
        this.initSocket()
        this.editor.on('change', e => {
            if (this.lastAppliedChange !== e) {
                this.socket.emit('change', JSON.stringify(e))
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        this.socket.disconnect()
    }

    autoSave = () => {
        if (this.lastChange.getTime() > this.lastSave.getTime()) {
            const res = saveFile({
                id: this.props.doc._id,
                content: this.markdown,
                filename: this.filename
            })
            this.lastSave = new Date(res.doc.lastEdited)
        } else {
            console.log("No change")
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

export default CodeEditor
