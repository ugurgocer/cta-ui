import React, { useContext, useState } from 'react'
import { Form, Select, Button, Divider, Input } from 'antd'
import Localize from './../global/Localize'
import CodeMirror from './CodeArea'
import JoditEditor from 'jodit-react'
import { AiOutlineCloseCircle, AiOutlinePlusCircle } from 'react-icons/ai'

import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'

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

const DocumentForm = props => {
    const { state } = useContext(Localize)
    const [value, setValue] = useState("JAVASCRIPT")

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
            <Form.Item label={state.translation.programming_language} name="language" rules={[{ required: true, whitespace: true }]} {...col}>
                <Select onSelect={setValue}>
                    <Select.Option key="JAVASCRIPT" value="JAVASCRIPT">Javascript</Select.Option>
                    <Select.Option key="PYTHON" value="PYTHON">Python</Select.Option>
                    <Select.Option key="XML" value="XML">Html</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label={state.translation.course_title} name="title" rules={[{ required: true, whitespace: true }]} {...col}>
                <Input size="large" />
            </Form.Item>
            <Form.Item label={state.translation.document} name="document" rules={[{ required: true, whitespace: true }]} {...col} >
                <JoditEditor
                    tabIndex={4}
                    ref={React.useRef(null)}
                />
            </Form.Item>
            <Form.Item label="Örnek Kodlar" {...col}>
                <Form.List name="codes">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                            {fields.map((field, index) => {
                                return (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                    >
                                        <AiOutlineCloseCircle
                                            size={24}
                                            style={{ verticalAlign: "middle", marginRight: 8, float: 'right' }}
                                            onClick={() => remove(field.name)}
                                        />
                                        <Form.Item
                                            {...col}
                                            {...field}
                                            noStyle
                                            getValueProps={val => val}
                                        >
                                            <CodeMirror name="code" value={props.initialValues && props.initialValues.codes[index] && props.initialValues.codes[index].code} options={{
                                                mode: value.toLowerCase()
                                            }}/>
                                        </Form.Item>
                                    </Form.Item>
                                )
                            })}
                        <Form.Item>
                            <Button
                                onClick={add}
                                style={{ width: '100%' }}
                            >
                            <AiOutlinePlusCircle
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            /> Add field
                            </Button>
                        </Form.Item>
                        </div>
                    )
                    }}
                </Form.List>
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

export default DocumentForm