import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import { Row, Col, message } from 'antd'
import RegisterForm from './../components/Register.form'
import gql from 'graphql-tag'
import Localize from './../global/Localize'

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
    const [register, { data, loading, error }] = useMutation(REGISTER);
    const { state } = useContext(Localize)

    const onRegister = async values => {
        try{
            await register({ variables: { register: values  }})

            message.success({ content: state.translation.messages['Register successful'] })
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Row style={{ height: "100%", width: "100%", position: "absolute" }} id="login-row">
            <Col {...layout.logo} style={{ position: "absolute"}}>
                <div className="logo" />
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