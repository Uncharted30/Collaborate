import React from "react";
import "./Landing.css"
import landingImg from "../../assets/img/landing-1.png"
import {Row, Col} from "antd";
// import {LoginBox} from "../../components/LoginBox"

class LandingPage extends React.Component {
    render() {
        return (
            <div id="landing-body">
                <Row >
                    <Col span={12}>
                        <h1 className="hello">Hello</h1>
                    </Col>
                    <Col span={12}>
                        <img src={landingImg} alt="" id="landing-img-1"/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {LandingPage}