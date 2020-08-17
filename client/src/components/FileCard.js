import {Card, message} from 'antd'
import React from "react";
import './FileCard.css'
import FileImg from "./FileImg";
import {axiosInstance as axios} from "../utils/axios";
import {withRouter} from "react-router-dom";

let FileType = (props) => {
    if (props.type === "markdown") {
        return (
            <p className='file-type'>
                Markdown File
            </p>
        )
    } else {
        return (
            <p className='file-type'>
                Source Code File
            </p>
        )
    }
}

class FileCard extends React.Component {

    createNewFile = () => {
        axios.post('/api/document/new', {
            type: this.props.type
        }).then(res => {
            console.log(res)
            if (res.data.msg === 'success') {
                this.props.history.push('/edit/' + res.data.id);
            } else {
                message.error(res.data.msg)
            }
        }).catch(e => {
            message.error('Error creating new file. ' + e)
        });
    }

    render() {
        return (
            <div className='file-card-div' onClick={this.createNewFile}>
                <Card id="file-card" hoverable={true}>
                    <FileImg type={this.props.type}/>
                </Card>
                <FileType type={this.props.type}/>
            </div>
        )
    }
}

export default withRouter(FileCard)