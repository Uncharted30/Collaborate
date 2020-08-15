import React, {useState} from 'react';
import './EditPage.css'
import CodeEditor from "../../components/CodeEditor";
import MDEditor from "../../components/MDEditor";
import {useParams} from "react-router-dom"
import {axiosInstance as axios} from "../../utils/axios";
import {message} from "antd";

let Editor = (props) => {
    if (props.type === 'markdown') {
        return (<MDEditor id='editor' doc={props.doc}/>)
    } else {
        return (<CodeEditor id='editor' doc={props.doc}/>)
    }
}

const EditPage = (props) => {
    const {type, id} = useParams()

    const [doc, setDoc] = useState(undefined)

    axios.get('/api/document/one/' + id).then((res) => {
        if (res.data.msg === 'succeed') {
            setDoc(res.data.doc)
        } else {
            message.error(res.data.msg)
        }
    }).catch(e => {
        message.error("Error fetching file. " + e)
    })

    if (doc) {
        return (
            <div id='edit-page-editor-div'>
                <Editor type={type} doc={doc}/>
            </div>
        );
    } else {
        return (<div/>)
    }

}

export default EditPage
