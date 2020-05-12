import React, { useContext } from 'react'
import { Form, Input, Button } from 'antd'
import { RiUserLine, RiLockPasswordLine } from 'react-icons/ri'
import Localize from './../global/Localize'

const Login = props => {
    const { state } = useContext(Localize)

    return (
        <Form
            layout="vertical"
            size="middle"
            name="basic"
            validateMessages={state.translation.form}
            onFinish={props.onLogin}
            onFinishFailed={props.onLogin}
        >
            <Form.Item label={state.translation.email} name="email" rules={[{ type: 'email', required: 'true' }]}>
                <Input prefix={<RiUserLine size={18} style={{ verticalAlign: 'middle' }} />} />
            </Form.Item>
            <Form.Item label={state.translation.password} name="password" rules={[{ required: 'true', min: 8 }]}>
                <Input type="password" prefix={<RiLockPasswordLine size={18} style={{ verticalAlign: 'middle' }} />} />
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" type="primary">
                    {state.translation.login}
                </Button>
            </Form.Item>
        </Form>
    )

}

export default Login