import { Table, Space } from 'antd';
import React from "react";

const columns = [
    {
        title: 'Email',
        dataIndex: 'email',
    },
    {
        title: 'Access',
        dataIndex: 'access',
    },
    {
        title: 'Action',
        render: () => (
            <Space size="middle">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a>Delete</a>
            </Space>
        ),
    },
];

class AccessTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        const data = []
        // eslint-disable-next-line no-unused-vars
        for (const [key, value] of Object.entries(this.props.userAccess)) {
            if (key === this.props.createdBy) continue
            data.push(value)
        }
        console.log(data)
        this.setState({
            data: data
        })
    }

    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.data} pagination={false}
                rowKey={'email'}
                style={{width: '100%'}}
            />
        )
    }
}

export default AccessTable