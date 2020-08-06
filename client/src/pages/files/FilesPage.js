import React from "react";
import {Row} from "antd"
import "./FilePage.css"

class FilesPage extends React.Component {
    render() {
        return (
            <div id="file-page-body">
                <Row id="file-create-section">
                    <div id='file-create-div'>
                        <h1>Create new files..</h1>
                    </div>
                </Row>
                <Row id="recent-file-section">
                    <div id='recent-file-div'>
                        <h1>Recent files..</h1>
                    </div>
                </Row>
            </div>
        )
    }
}

export default FilesPage