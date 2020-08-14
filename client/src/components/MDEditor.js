import React from "react";
import {Row} from "antd";
import FileOptions from "./FileOptions";
import MarkdownEditor from "@uiw/react-markdown-editor";
import './MDEditor.css'

class MDEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markdown: '# This is a H1  \n## This is a H2  \n###### This is a H6',
        };
        this.updateMarkdown = this.updateMarkdown.bind(this);
    }

    updateMarkdown(editor, data, value) {
        // this.setState({ markdown: value });
        console.log(data)
    }

    render() {
        return (
            <div id='editor-div'>
                <Row id='editor-info-row'>
                    <div>
                        <FileOptions/>
                    </div>
                </Row>
                <MarkdownEditor
                    value={this.state.markdown}
                    onChange={this.updateMarkdown}
                    height={'calc(100vh - 200px)'}
                />
            </div>
        );
    }
}

export default MDEditor