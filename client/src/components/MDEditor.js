import React from "react";
import {message, Row} from "antd";
import FileOptions from "./FileOptions";
import MarkdownEditor from "@uiw/react-markdown-editor";
import './MDEditor.css'
import {axiosInstance as axios} from "../utils/axios";

const AUTO_SAVE_INTERVAL = 5000

class MDEditor extends React.Component {
    constructor(props) {
        super(props);
        this.filename = props.doc.filename
        this.markdown = props.doc.content
        this.lastSave = props.doc.lastEdited
        this.lastChange = props.doc.lastEdited
        this.updateMarkdown = this.updateMarkdown.bind(this);
    }

    updateMarkdown(editor, data, value) {
        // this.setState({ markdown: value });
        // console.log(data)
        if (!this.editor) this.editor = editor
        this.lastChange = new Date()
        // this.markdown = editor.doc.getValue()
        console.log(editor)
        console.log(data)
        // console.log(this.markdown)
    }

    setFilename = (filename) => {
        this.filename = filename
        console.log(filename)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
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
                    value={this.props.doc.content}
                    onChange={this.updateMarkdown}
                    height={'calc(100vh - 200px)'}
                />
            </div>
        );
    }
}

export default MDEditor