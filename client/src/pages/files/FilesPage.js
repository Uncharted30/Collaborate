import React from "react";
import {Row, Col, Select, message} from "antd"
import "./FilePage.css"
import FileCard from "../../components/FileCard"
import RecentFileCard from "../../components/RecentFileCard";
import {withRouter} from "react-router-dom";
import {axiosInstance as axios} from "../../utils/axios";
import cookies from "react-cookies";

class FilesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            docs:[],
            filter: 'all',
            order: 'open'
        }
    }

    fetchData = () => {
        axios.get('/api/document/list').then(res => {
            if (res.data.msg === 'success') {
                res.data.docs.forEach(file => {
                    file.lastEdited = new Date(file.lastEdited)
                    file.lastOpened = new Date(file.lastOpened)
                })
                res.data.docs.sort((f1, f2) => f2.lastOpened.getTime() - f1.lastOpened.getTime())
                this.setState({
                    docs: res.data.docs
                })
                this.userId = res.data.userId
            } else if (res.data.msg === 'Unauthorized') {
                message.error("Unauthorized. Please sign in first.")
                setTimeout(this.handleUnauthorized, 3000)
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

    handleUnauthorized = () => {
        cookies.remove('token')
        this.props.history.push('/')
    }

    handleFilterSelect = (option) => {
        this.setState({
            filter: option
        })
    }

    handleOrderSelect = (option) => {
        let compareFn

        if (option === 'filename') {
            compareFn = (f1, f2) => {
                if (f1.filename > f2.filename) return -1
                else if (f1.filename < f2.filename) return 1
                return 0
            }
        } else if (option === 'open') {
            compareFn = (f1, f2) => f2.lastOpened.getTime() - f1.lastOpened.getTime()
        } else {
            compareFn = (f1, f2) => f2.lastEdited.getTime() - f1.lastEdited.getTime()
        }

        this.state.docs.sort(compareFn)
        this.setState({
            order: option
        })
    }

    filterFile = (file) => {
        if (this.state.filter === 'created' && file.createdBy !== this.userId){
            return false
        } else if (this.state.filter === 'shared' && file.createdBy === this.userId) {
            return false
        }
        return true
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
                                    <Select
                                        defaultValue="all"
                                        style={{ width: 150, textAlign:'left' }}
                                        onSelect={this.handleFilterSelect}>
                                        <Option value="all">All</Option>
                                        <Option value="created">Created by me</Option>
                                        <Option value="shared">Shared by others</Option>
                                    </Select>
                                </div>
                                <div className='filter-div'>
                                    <span>Sort by: </span>
                                    <Select
                                        defaultValue="open"
                                        style={{ width: 180, textAlign:'left' }}
                                        onSelect={this.handleOrderSelect}>
                                        <Option value="filename">Filename</Option>
                                        <Option value="open">Last opened by me</Option>
                                        <Option value="edit">Last edited</Option>
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row className='recent-files-row'>
                            {this.state.docs.filter(this.filterFile).map((doc) => {
                                return <RecentFileCard doc={doc} key={doc.id} fetchList={this.fetchData}/>
                            })}
                        </Row>
                    </div>
                </Row>
            </div>
        )
    }
}

export default withRouter(FilesPage)