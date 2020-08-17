import {Button, Dropdown, Input, Menu, message, Modal, Row, Select} from 'antd';
import React from "react";
import './FileOptions.css'
import {Divider} from "@material-ui/core";
import AccessTable from "./AccessTable";
import {axiosInstance as axios} from "../utils/axios";

const {SubMenu} = Menu;
const {Option} = Select;

const setAccessType = (newAccessType, fileId, fetchFile) => {
    axios.put('/api/document/accessType', {
        accessType: newAccessType,
        id: fileId
    }).then(res => {
        if (res.data.msg === 'success') {
            message.success('Success.')
            fetchFile()
        } else {
            console.log(res)
            message.error(res.data.msg.toString())
        }
    }).catch(e => {
        message.error(e.toString())
    })
}

const PrivateAccessInfo = (props) => {
    return (
        <div>
            <Row>
                <Input.Group compact>
                    <Input style={{width: '70%'}} placeholder='Email Address'/>
                    <Select defaultValue="edit" style={{width: '30%'}}>
                        <Option value="edit">Edit Access</Option>
                        <Option value="read">Read Access</Option>
                    </Select>
                </Input.Group>
            </Row>
            <Row id='share-button-row'>
                <Button type="primary">
                    Share
                </Button>
            </Row>
            <Divider/>
            <Row id='access-table'>
                <p>Users who have access to this file:</p>
                <AccessTable userAccess={props.doc.access} createdBy={props.doc.createdBy}/>
            </Row>
            <Row style={{marginTop: 10, height: 15}}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <p>Or you could switch to <a onClick={e => {
                    e.preventDefault()
                    setAccessType('public-read', props.doc._id, props.fetchFile)
                }}>public access</a></p>
            </Row>
        </div>
    )
}

const PublicAccessInfo = (props) => {
    const publicEdit = props.doc.accessType.endsWith('edit')
    return (
        <div>
            <p>According to your settings, everyone who has the link could
                {publicEdit ? ' edit' : ' read'} this file.</p>
            <p><span>You could change it to </span>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a onClick={e => {
                    e.preventDefault()
                    const newAccessType = publicEdit ? 'public-read' : 'public-edit'
                    setAccessType(newAccessType, props.doc._id, props.fetchFile)
                }}>
                     everyone could {publicEdit ? ' read' : ' edit'} this file
                </a>.
            </p>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <p>Or change it to <a onClick={e => {
                e.preventDefault()
                setAccessType('controlled', props.doc._id, props.fetchFile)
            }}>private access</a>, only people added can read or edit this file.</p>
        </div>
    )
}

const AccessInfo = (props) => {
    if (props.doc.accessType === 'controlled') {
        return <PrivateAccessInfo doc={props.doc} fetchFile={props.fetchFile}/>
    } else {
        return <PublicAccessInfo doc={props.doc} fetchFile={props.fetchFile}/>
    }
}

class FileOptions extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            accessType: props.doc.accessType,
            access: props.doc.access
        }
    }

    setFilename = (e) => {
        const newFilename = e.target.value
        this.props.setFilename(newFilename)
    }

    openModal = () => {
        this.setState({
            visible: true
        })
    }

    closeModal = () => {
        this.setState({
            visible: false
        })
    }

    menu = (
        <Menu className='file-option-menu'>
            <Menu.Item onClick={this.openModal}>
                Share
            </Menu.Item>
            <SubMenu title="New...">
                <Menu.Item>
                    Markdown file
                </Menu.Item>
                <Menu.Item>
                    Source code file
                </Menu.Item>
            </SubMenu>
            <Menu.Item>
                Make a copy
            </Menu.Item>
            <Menu.Item>
                Download
            </Menu.Item>
        </Menu>
    )

    render() {
        return (
            <div className='editor-info-div'>
                <Input
                    defaultValue={this.props.doc.filename}
                    bordered={false}
                    style={{width: 140}}
                    className='filename-input'
                    onBlur={this.setFilename}/>
                <Divider orientation="vertical" flexItem style={{height: 39}}/>
                <Dropdown overlay={this.menu} className='option-dropdown' trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href='/'>
                        Options
                    </a>
                </Dropdown>

                <Modal
                    title="Share"
                    visible={this.state.visible}
                    onCancel={this.closeModal}
                    footer={null}
                >
                    <AccessInfo doc={this.props.doc} fetchFile={this.props.fetchFile}/>
                </Modal>
            </div>
        )

    }
}

export default FileOptions