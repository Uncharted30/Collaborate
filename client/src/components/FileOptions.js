import {Button, Dropdown, Form, Input, Menu, message, Modal, Row, Select} from 'antd';
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
            message.error(res.data.msg.toString())
        }
    }).catch(e => {
        message.error(e.toString())
    })
}

const PrivateAccessInfo = (props) => {

    const addAccess = (value) => {
        axios.put('/api/document/access/add', {
            docId: props.doc._id,
            userEmail: value.email,
            access: value.access
        }).then(res => {
            if (res.data.msg === 'success') {
                message.success('Success.')
                props.fetchFile()
            } else {
                message.error(res.data.msg)
            }
        }).catch(e => {
            message.error(e)
        })
    }

    return (
        <div>
            <Form onFinish={addAccess} initialValues={{access: 'edit'}}>
                <Input.Group compact style={{height: 32}}>
                    <Form.Item name='email' style={{width: '70%'}}>
                        <Input placeholder='Email Address'/>
                    </Form.Item>

                    <Form.Item name='access' style={{width: '30%'}}>
                        <Select>
                            <Option value="edit">Edit Access</Option>
                            <Option value="read">Read Access</Option>
                        </Select>
                    </Form.Item>
                </Input.Group>
                <Row id='share-button-row'>
                    <Button type="primary" htmlType='submit'>
                        Share
                    </Button>
                </Row>
            </Form>
            <Divider/>
            <Row id='access-table'>
                <p>Users who have access to this file:</p>
                <AccessTable
                    doc={props.doc}
                    fetchFile={props.fetchFile}/>
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