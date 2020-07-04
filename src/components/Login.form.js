import React, { useContext } from 'react'
import { Form, Input, Button } from 'antd'

import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'
import Localize from './../global/Localize'
import { Link } from 'react-router-dom'

const LoginForm = props => {
    const { state } = useContext(Localize)

    return (
        <Form
            layout="vertical"
            size="middle"
            name="basic"
            validateMessages={state.translation.form}
            onFinish={props.onLogin}
            onFinishFailed={props.onLogin}
            style={{ width: "100%" }}
        >
            <Form.Item label={state.translation.email} name="email" rules={[{ type: 'email', required: 'true', whitespace: true }]}>
                <Input prefix={<RiUserLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item label={state.translation.password} name="password" rules={[{ required: 'true', min: 8,  whitespace: true }]}>
                <Input type="password" prefix={<RiLockPasswordLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" size="large" style={{ marginRight: 16}} loading={props.loading}>
                    {state.translation.login}
                </Button>
                { state.translation.or }
                <Link to="/register" style={{ marginLeft: 16, fontSize: 16}}>
                    {state.translation.register}
                </Link>
            </Form.Item>
        </Form>
    )

}

export default LoginForm