import React from 'react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import './CodeEditor.css'
import {Input, Row, Select} from "antd";
import {Divider} from "@material-ui/core";

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
                    <Select defaultValue="java" style={{ width: 95 }} bordered={false}>
                        <Option value="java">Java</Option>
                        <Option value="c_c++">C/C++</Option>
                        <Option value="python">Python</Option>
                        <Option value="javascript">JavaScript</Option>
                        <Option value="golang">Go</Option>
                        <Option value="swift">Swift</Option>
                        <Option value="scala">Scala</Option>
                        <Option value='css'>CSS</Option>
                        <Option value='html'>HTML</Option>
                        <Option value='MySQL'>MySQL</Option>
                    </Select>
                    <Select defaultValue="github" style={{ width: 100 }} bordered={false}>
                        <Option value="github">GitHub</Option>
                        <Option value="eclipse">Eclipse</Option>
                        <Option value="twilight">Twilight</Option>
                        <Option value="xcode">XCode</Option>
                        <Option value="monokai">Monokai</Option>
                    </Select>
                </Row>
                <Divider light/>
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
