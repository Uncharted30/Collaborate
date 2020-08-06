import React from "react";
import "./Landing.css"
import landingImg1 from "../../assets/img/landing-1.png"
import landingImg2 from "../../assets/img/landing-2.png"
import {Row, Col} from "antd";
import LoginBox from "../../components/LoginBox";
import Logo from "../../assets/img/logo.svg"

// import {LoginBox} from "../../components/LoginBox"

class LandingPage extends React.Component {
    render() {
        return (
            <div id="landing-body">
                <Row id="title-row">
                    <Col span={12}>
                        {/*<h1 id="heading">Collaborate!</h1>*/}
                        <img src={Logo} id="landing-logo" alt=""/>
                    </Col>
                </Row>
                <Row id="landing-row">
                    <Col span={12}>
                        <Row>
                            <Col span={24} id="login-box-col">
                                <LoginBox/>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <h3 id="landing-slogan">Share, edit, collaborate, everywhere.</h3>
                        <img src={landingImg1} alt="" id="landing-img-1" className="imgBounce"/>
                        <img src={landingImg2} alt="" id="landing-img-2"/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export {LandingPage}