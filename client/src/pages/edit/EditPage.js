import React from 'react';
import './EditPage.css'
import CodeEditor from "../../components/CodeEditor";
import MDEditor from "../../components/MDEditor";
import {useParams} from "react-router-dom"

let Editor = (props) => {
    if (props.type === 'markdown') {
        return (<MDEditor id='editor'/>)
    } else {
        return (<CodeEditor id='editor'/>)
    }
}

const EditPage = (props) => {
    const {type} = useParams()
    return (
        <div id='edit-page-editor-div'>
            <Editor type={type}/>
        </div>
    );
}

export default EditPage
