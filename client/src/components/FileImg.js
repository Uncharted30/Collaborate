import MdIcon from "../assets/img/markdown-icon.png";
import CodeIcon from "../assets/img/code-icon.png";
import './FileImg.css'
import React from "react";

let FileImg = (props) => {
    if (props.type === "markdown") {
        return <img src={MdIcon} alt='' className='md-icon'/>
    } else {
        return <img src={CodeIcon} alt='' className='code-icon'/>
    }
}

export default FileImg