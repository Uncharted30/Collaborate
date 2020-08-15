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
import {axiosInstance as axios} from "../utils/axios";
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
    }

    onChange(newValue) {
        this.content = newValue
        this.lastChange = new Date()
        console.log(newValue)
    }

    setFilename = (filename) => {
        this.filename = filename
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
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    autoSave = () => {
        if (this.lastChange.getTime() > this.lastSave.getTime()) {
            this.saveFile()
        } else {
            console.log("No change")
        }
    }

    saveFile = () => {
        axios.put('/api/document', {
            id: this.props.doc._id,
            content: this.content,
            filename: this.filename
        }).then(res => {
            if (res.data.msg === 'succeed') {
                console.log(res.data.doc.lastEdited)
                this.lastSave = new Date(res.data.doc.lastEdited)
            } else {
                message.error('Error saving file. ' + res.data.msg)
            }
        }).catch(e => {
            message.error('Error saving file. ' + e)
        })
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
                    value={this.content}
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    width='100%'
                    className='ace-editor'
                    onLoad={instance => this.editor = instance}
                />
            </div>
        );
    }
}

export default CodeEditor
