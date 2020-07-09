import React, { useContext } from 'react'
import { Form, Input, Button } from 'antd'
import { RiUserLine, RiLockPasswordLine, RiUserAddLine, RiMailLine } from 'react-icons/ri'
import Localize from './../global/Localize'
import { Link } from 'react-router-dom'

const RegisterForm = props => {
    const { state } = useContext(Localize)

    return (
        <Form
            layout="vertical"
            size="middle"
            name="basic"
            validateMessages={state.translation.form}
            onFinish={props.onRegister}
            style={{ width: "100%" }}
        >
            <Form.Item label={state.translation.fullName } name="fullName" rules={[{ type: 'string', required: 'true', whitespace: true }]}>
                <Input prefix={<RiUserAddLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item label={state.translation.username } name="username" rules={[{ type: 'string', required: 'true', min: 3, max: 50, whitespace: true}]}>
                <Input prefix={<RiUserLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item label={state.translation.email} name="email" rules={[{ type: 'email', required: 'true',  whitespace: true}]}>
                <Input prefix={<RiMailLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item label={state.translation.password} name="password" rules={[{ required: 'true', min: 8,  whitespace: true}]}>
                <Input type="password" prefix={<RiLockPasswordLine size={18} style={{ verticalAlign: 'middle' }} />} size="large" />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary" size="large" style={{ marginRight: 16}} loading={props.loading}>
                    {state.translation.register}
                </Button>
                { state.translation.or }
                <Link to="/login" style={{ marginLeft: 16, fontSize: 16}}>
                    {state.translation.login}
                </Link>
            </Form.Item>
        </Form>
    )

}

export default RegisterForm