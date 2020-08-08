import React from 'react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import './CodeEditor.css'
import {Input, Row, Select} from "antd";
import {Divider} from "@material-ui/core";
import CodeSelector from "./CodeSelector";
import ThemeSelector from "./ThemeSelector";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import FileOptions from "./FileOptions";

const { Option } = Select;

class CodeEditor extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.onChange = this.onChange.bind(this);
    }

    onChange(newValue) {
        console.log('change', newValue);
    }

    render() {
        return (
            <div id='editor-div'>
                <Row id='editor-info-row'>
                    <Input defaultValue="Filename" bordered={false} style={{width: 180}} className='filename-input'/>
                    <Divider orientation="vertical" flexItem style={{height:39}}/>
                    <FileOptions/>
                    <Divider orientation="vertical" flexItem style={{height:39}}/>
                    <ThemeSelector/>
                    <Divider orientation="vertical" flexItem style={{height:39}}/>
                    <CodeSelector/>
                    <Divider orientation="vertical" flexItem style={{height:39}}/>
                </Row>
                <AceEditor
                    mode="java"
                    theme="github"
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
