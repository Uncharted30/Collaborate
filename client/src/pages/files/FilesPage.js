import React from "react";
import {Row, Col, Select, message} from "antd"
import "./FilePage.css"
import FileCard from "../../components/FileCard"
import RecentFileCard from "../../components/RecentFileCard";
import {withRouter} from "react-router-dom";
import {axiosInstance as axios} from "../../utils/axios";

class FilesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            docs:[]
        }
    }

    fetchData = () => {
        axios.get('/api/document/list').then(res => {
            if (res.data.msg === 'succeed') {
                console.log(res)
                this.setState({
                    docs: res.data.docs
                })
            } else {
                message.error("Error fetching files. " + res.data.msg)
            }
        }).catch(e => {
            message.error("Error fetching files. " + e)
        })
    }

    componentDidMount() {
        this.fetchData()
    }

    render() {
        const {Option} = Select
        return (
            <div id="file-page-body">
                <Row id="file-create-section">
                    <div id='file-create-div'>
                        <h1>
                            <Row className='file-section-title'>
                                <p>Create a new file:</p>
                            </Row>
                            <Row>
                                <FileCard type="markdown"/>
                                <FileCard type="code"/>
                            </Row>
                        </h1>
                    </div>
                </Row>
                <Row id="recent-file-section">
                    <div id='recent-file-div'>
                        <Row className='file-section-title'>
                            <Col span={4}>
                                <p>Recent files:</p>
                            </Col>
                            <Col span={20} id='filter-col'>
                                <div className='filter-div'>
                                    <span>Show files: </span>
                                    <Select defaultValue="owned" style={{ width: 150, textAlign:'left' }}>
                                        <Option value="all">All</Option>
                                        <Option value="owned">Owned by me</Option>
                                        <Option value="shared">Shared by others</Option>
                                    </Select>
                                </div>
                                <div className='filter-div'>
                                    <span>Sort by: </span>
                                    <Select defaultValue="open" style={{ width: 180, textAlign:'left' }}>
                                        <Option value="title">Title</Option>
                                        <Option value="open">Last opened by me</Option>
                                        <Option value="edit">Last edited</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row className='recent-files-row'>
                            {this.state.docs.map((doc) => {
                                return <RecentFileCard doc={doc} key={doc.id}/>
                            })}
                        </Row>
                    </div>
                </Row>
            </div>
        )
    }
}

export default withRouter(FilesPage)