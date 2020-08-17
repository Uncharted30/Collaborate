import React from 'react';
import './EditPage.css'
import CodeEditor from "../../components/CodeEditor";
import MDEditor from "../../components/MDEditor";
import {withRouter} from "react-router-dom"
import {axiosInstance} from "../../utils/axios";
import {message, Modal} from "antd";
import cookies from "react-cookies";

let Editor = (props) => {
    if (props.type === 'markdown') {
        return (<MDEditor id='editor' doc={props.doc} fetchFile={props.fetchFile}/>)
    } else {
        return (<CodeEditor id='editor' doc={props.doc} fetchFile={props.fetchFile}/>)
    }
}

class EditPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            doc: null
        }
        console.log(props)
    }

    handleUnauthorized = () => {
        cookies.remove('token')
        this.props.history.push('/')
    }

    fetchData = () => {
        axiosInstance.get('/api/document/one/' + this.props.match.params.id).then((res) => {
            console.log(res)
            if (res.data.msg === 'success') {
                this.setState({
                    doc: res.data.doc
                })
            } else if (res.data.msg === 'Unauthorized') {
                message.error('Unauthorized. Please sign in first.');
                setTimeout(this.handleUnauthorized, 2000)
            } else if (res.data.msg === 'no_access') {
                Modal.warning({
                    content: 'You have no access to this file, please contact creator of the file to grand you access.',
                    okText: 'Back to my files',
                    onOk: () => this.props.history.replace('/files')
                })
            } else {
                message.error(res.data.msg)
            }
        }).catch(e => {
            if (e.toString() !== 'Cancel') message.error("Error fetching file. " + e)
        })
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        if (this.state.doc !== null) {
            return (
                <div id='edit-page-editor-div'>
                    <Editor type={this.state.doc.type} doc={this.state.doc} fetchFile={this.fetchData}/>
                </div>
            );
        } else {
            return (<div/>)
        }
    }

}

export default withRouter(EditPage)
