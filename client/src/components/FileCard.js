import {Card} from 'antd'
import React from "react";
import './FileCard.css'
import FileImg from "./FileImg";
import {withRouter} from "react-router-dom";
import {createNewFile} from "../utils/fileUtils";

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

    onCreate = () => {
        createNewFile(this.props.type, this.props.history)
    }

    render() {
        return (
            <div className='file-card-div' onClick={this.onCreate}>
                <Card id="file-card" hoverable={true}>
                    <FileImg type={this.props.type}/>
                </Card>
                <FileType type={this.props.type}/>
            </div>
        )
    }
}

export default withRouter(FileCard)