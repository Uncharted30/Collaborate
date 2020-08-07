import React from "react";
import {Card, Col, Row} from "antd";
import Screenshot from '../assets/img/file-screenshot.png'
import './RecentFileCard.css'

class RecentFileCard extends React.Component {
    render() {
        return (
            <Card className='recent-file-card' cover={<img id='card-cover' alt='' src={Screenshot}/>} hoverable={true}>
                <Col span={18} className='file-info-row'>
                    <Row className='filename-row'>Filename</Row>
                    <Row className='date-row'>{new Date().toDateString()}</Row>
                </Col>
                <Col span={6}>

                </Col>
            </Card>)
    }
}

export default RecentFileCard