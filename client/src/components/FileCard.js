import {Card} from 'antd'
import React from "react";
import './FileCard.css'
import CodeIcon from '../assets/img/code-icon.png'
import MdIcon from '../assets/img/markdown-icon.png'

let FileDisplay = (props) => {
    if (props.type === "markdown") {
        return <img src={MdIcon} alt='' className='md-icon'/>
    } else {
        return <img src={CodeIcon} alt='' className='code-icon'/>
    }
}

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
    render() {
        return (
            <div className='file-card-div'>
                <Card id="file-card" hoverable={true}>
                    <FileDisplay type={this.props.type}/>
                </Card>
                <FileType type={this.props.type }/>
            </div>
        )
    }
}

export default FileCard