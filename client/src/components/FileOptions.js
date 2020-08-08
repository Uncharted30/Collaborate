import { Menu } from 'antd';
import React from "react";
import './FileOptions.css'
import {Divider} from "@material-ui/core";
const { SubMenu } = Menu;

class FileOptions extends React.Component {
    render() {
        return (
            <Menu  mode="horizontal" className='file-option-menu'>
                <SubMenu title="Options">
                    <Menu.Item>
                        Share
                    </Menu.Item>
                    <Divider/>
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
                </SubMenu>
            </Menu>
        )

    }
}

export default FileOptions