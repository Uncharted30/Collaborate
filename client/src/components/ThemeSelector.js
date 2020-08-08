import {Select} from "antd";
import React from "react";

const { Option } = Select;

let ThemeSelector = (props) => {
    return (
        <Select defaultValue="java" style={{ width: 110 }} bordered={false}>
            <Option value="java">Java</Option>
            <Option value="c_c++">C/C++</Option>
            <Option value="python">Python</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="golang">Go</Option>
            <Option value="swift">Swift</Option>
            <Option value="scala">Scala</Option>
            <Option value='css'>CSS</Option>
            <Option value='html'>HTML</Option>
            <Option value='MySQL'>MySQL</Option>
        </Select>
    )
}

export default ThemeSelector