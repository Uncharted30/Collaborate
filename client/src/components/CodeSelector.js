import {Select} from "antd";
import React from "react";

const {Option} = Select;

let CodeSelector = (props) => {
    let onSelect = (value) => {
        props.changeMode(value)
    }

    return (
        <Select defaultValue="java" style={{width: 110}} bordered={false} onSelect={onSelect}>
            <Option value="java">Java</Option>
            <Option value="c_c++">C/C++</Option>
            <Option value="python">Python</Option>
            <Option value="javascript">JavaScript</Option>
            <Option value="golang">Go</Option>
            <Option value="swift">Swift</Option>
            <Option value="scala">Scala</Option>
            <Option value='css'>CSS</Option>
            <Option value='html'>HTML</Option>
            <Option value='mysql'>MySQL</Option>
        </Select>
    )
}

export default CodeSelector