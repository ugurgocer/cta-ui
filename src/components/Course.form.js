import React, { useContext, useState } from 'react'
import { Form, Input, Button, Upload, message, Divider } from 'antd'
import Localize from './../global/Localize'
import { resizeImage } from './../utils/image'

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

const fileType = [
    '.jpg',
    '.png'
]

const CourseForm = props => {
    const { state } = useContext(Localize)
    const [ image, setImage ] = useState(props.initialValues ? props.initialValues.image : null)

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
            <Form.Item label={state.translation.course_title} name="title" rules={[{ required: true, whitespace: true }]} {...col}>
                <Input size="large" />
            </Form.Item>
            <Form.Item label={state.translation.seo_link} name="seoLink" normalize={value => value.trim()} rules={[{ required: true, whitespace: true }]} {...col}>
                <Input size="large" />
            </Form.Item>
            <Form.Item label={state.translation.description} name="description" rules={[{ required: true, min: 0, max:1000,  whitespace: true }]} {...col} >
                <Input.TextArea size="large" autoSize={{ minRows: 6, maxRows: 6 }} />
            </Form.Item>
            <Form.Item label={state.translation.image} name="image" normalize={value => value.file} {...col} >
                <Upload
                    accept={fileType.join[',']}
                    beforeUpload={file => {
                        const ext = file.name.split('.')

                        if(fileType.indexOf("." + ext[ext.length - 1]) === -1){
                            message.warning("Format Uymuyor")
                            return Promise.reject('*')
                        }
                    }}
                    method="get"
                    action={file => (
                        new Promise((r, j) => {
                            let  reader = new FileReader()
                            reader.readAsDataURL(file)

                            reader.onload = e => {
                                const img = new Image()
                                img.src = e.target.result.toString()
                                img.onload = function(){
                                    r(resizeImage(this, 200, 200))
                                }
                            }
                        }).then(url => setImage({...file, url, response: 'upload done'}))
                    )}
                    onRemove={() => setImage(null)}
                    listType="picture-card"
                    fileList={image ? [image] : []}
                    showUploadList={{
                        showPreviewIcon: false
                    }}
                >
                    <Button>{state.translation['Click to Upload']}</Button>
                </Upload>
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

export default CourseForm