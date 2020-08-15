import React from "react";
import "./Landing.css"
import landingImg1 from "../../assets/img/landing-1.png"
import landingImg2 from "../../assets/img/landing-2.png"
import {Row, Col} from "antd";
import Logo from "../../assets/img/logo.svg"
import SignIn from "../../components/SignInBox";
import SignUp from "../../components/SignUpBox";

// import {LoginBox} from "../../components/LoginBox"

class LandingPage extends React.Component {
    switchToSignUp = (e) => {
        e.preventDefault()
        this.setState({
            show: this.signUp
        })
    }

    switchToSignIn = (e) => {
        e.preventDefault()
        this.setState({
            show: this.signIn
        })
    }

    signIn = <SignIn switchToSignUp={this.switchToSignUp}/>
    signUp = <SignUp switchToSignIn={this.switchToSignIn}/>

    constructor(props) {
        super(props);
        this.state = {
            show: this.signIn
        }
    }

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
                                <div className='flipper'>
                                    {this.state.show}
                                </div>
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