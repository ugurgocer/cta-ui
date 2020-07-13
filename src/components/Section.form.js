import React, { useContext } from 'react'
import { Form, Input, Button, Divider } from 'antd'
import Localize from './../global/Localize'

const col = {
    labelCol: {
        md: { span: 4, offset: 3},
        lg: { span: 3, offset: 3},
        xl: { span: 2, offset: 3},
    },
    wrapperCol: {
        md: { span: 12, offset: 1},
        lg: { span: 10, offset: 1},
        xl: { span: 10, offset: 1},
    }
}

const colButton = {
    md: { span: 4, offset: 16},
    lg: { span: 6, offset: 10},
    xl: { span: 5, offset: 10},
}

const SectionForm = props => {
    const { state } = useContext(Localize)

    return (
        <Form
            layout="horizontal"
            size="middle"
            name="basic"
            validateMessages={state.translation.form}
            onFinish={props.onSubmit}
            style={{ width: "100%" }}
            initialValues={props.initialValues}
        >
            <Form.Item label={state.translation.section_title} name="title" rules={[{ required: true, whitespace: true }]} {...col}>
                <Input size="large" />
            </Form.Item>
            <Form.Item label={state.translation.description} name="description" rules={[{ required: true, min: 0, max:1000,  whitespace: true }]} {...col} >
                <Input.TextArea size="large" autoSize={{ minRows: 6, maxRows: 6 }} />
            </Form.Item>
            <Divider type="horizontal" />
            <Form.Item wrapperCol={colButton}>
                <Button htmlType="submit" type="primary" size="large" style={{ marginRight: 16, float: 'right'}} loading={props.loading}>
                    {state.translation.save}
                </Button>
            </Form.Item>
        </Form>
    )

}

export default SectionForm