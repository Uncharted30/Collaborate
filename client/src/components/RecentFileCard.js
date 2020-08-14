import React from "react";
import {Card, Col, Row} from "antd";
import './RecentFileCard.css'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from "@material-ui/core/IconButton";
import FileImg from "./FileImg";
import {Link} from "react-router-dom";

class RecentFileCard extends React.Component {

    render() {
        return (
           <Link to={'/edit/' + this.props.doc.type + '/' + this.props.doc.id}>
               <Card className='recent-file-card' cover={<div id='card-cover'><FileImg type={this.props.doc.type}/></div>} hoverable={true}>
                   <Row>
                       <Col span={18} className='file-info-row'>
                           <Row className='filename-row'>{this.props.doc.filename}</Row>
                           <Row className='date-row'>{new Date(this.props.doc.lastEdited).toDateString()}</Row>
                       </Col>
                       <Col span={6} className='more-icon-col'>
                           <IconButton aria-label="More" size="small">
                               <MoreVertIcon/>
                           </IconButton>
                       </Col>
                   </Row>
               </Card>
           </Link>
        )
    }
}

export default RecentFileCard