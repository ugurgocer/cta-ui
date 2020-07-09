import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import Session from './../global/Session'

import { Row, Col, message } from 'antd'
import RegisterForm from './../components/Register.form'
import { Redirect } from 'react-router-dom'

import './../asset/login.css'

const layout = {
    login: {
        xs: 24,
        sm: 24,
        md: 16,
        lg: 12,
        xl: 8,
    },
    space: {
        xs: 0,
        sm: 0,
        md: 4,
        lg: 6,
        xl: 7,
    },
    logo: {
        xs: 7,
        sm: 6,
        md: 6,
        lg: 4,
        xl: 3,
        id: "logo"
    },
}

const REGISTER = (
    gql`
        mutation($register: Register!){
            register(register: $register){
                token
                date
                expiryDate
                loginType
            }
        }
    `
)

const Register = props => {
    const [register, { loading }] = useMutation(REGISTER);
    const { state } = useContext(Localize)
    const { dispatch: sessionDispatch } = useContext(Session)

    if(localStorage.session)
        return <Redirect to="/" />

    const onRegister = async values => {
        try{
            const result = await register({ variables: { register: values  }})
            
            await sessionDispatch({ type: 'login', session: result.data.register })

            message.success({ content: state.translation.messages['Register successful'] })

            props.history.push('/')
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Row style={{ height: "100%", width: "100%", position: "absolute" }} id="login-row">
            <Col {...layout.logo} style={{ position: "absolute"}}>
                <div className="logo-login" />
                <span id="slogan">learn coding <br/> step by ctapp</span>
            </Col>
            <Col {...layout.space} />
            <Col {...layout.space} />
            <Col {...layout.login} style={{ height: "100%" }}>
                <Col span={24} className="login-col-before" style={{ height: "33%" }} />
                <Col span={24} className="login-col" style={{ height: "67%" }}>
                    <RegisterForm onRegister={onRegister} loading={loading}/>
                </Col>
            </Col>
        </Row>
    )

}

export default Register