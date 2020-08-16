import React, {useState, useEffect} from 'react';
import './EditPage.css'
import CodeEditor from "../../components/CodeEditor";
import MDEditor from "../../components/MDEditor";
import {useParams} from "react-router-dom"
import {axiosInstance} from "../../utils/axios";
import axios from 'axios'
import {message} from "antd";
import cookies from "react-cookies";
import { useHistory } from 'react-router-dom'

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

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    const history = useHistory()

    const handleUnauthorized = () => {
        cookies.remove('token')
        history.push('/')
    }

    axiosInstance.get('/api/document/one/' + id, {cancelToken: source.token}).then((res) => {
        if (res.data.msg === 'succeed') {
            setDoc(res.data.doc)
        } else if (res.data.msg === 'Unauthorized') {
            message.error('Unauthorized. Please sign in first.');
            setTimeout(handleUnauthorized, 2000)
        } else {
            message.error(res.data.msg)
        }
    }).catch(e => {
        if (e.toString() !== 'Cancel')message.error("Error fetching file. " + e)
    })

    useEffect(() => {
        return () => {
            source.cancel()
        }
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
