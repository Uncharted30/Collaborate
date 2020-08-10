import {Dropdown, Input, Menu} from 'antd';
import React from "react";
import './FileOptions.css'
import {Divider} from "@material-ui/core";

const {SubMenu} = Menu;

const menu = (
    <Menu className='file-option-menu'>
        <Menu.Item>
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

class FileOptions extends React.Component {

    render() {
        return (
            <div className='editor-info-div'>
                <Input defaultValue="Filename" bordered={false} style={{width: 140}} className='filename-input'/>
                <Divider orientation="vertical" flexItem style={{height:39}}/>
                <Dropdown overlay={menu} className='option-dropdown' trigger={['click', 'hover']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()} href=''>
                        Options
                    </a>
                </Dropdown>
            </div>
        )

    }
}

export default FileOptions