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

class CodeEditor extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
        this.state = {
            mode: 'java',
            theme: 'github'
        }
    }

    onChange(newValue) {
        console.log('change', newValue);
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

    render() {
        return (
            <div id='editor-div'>
                <Row id='editor-info-row'>
                    <div>
                        <FileOptions/>
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
                    name="UNIQUE_ID_OF_DIV"
                    editorProps={{
                        $blockScrolling: true
                    }}
                    width='100%'
                    className='ace-editor'
                />
            </div>
        );
    }
}

export default CodeEditor
