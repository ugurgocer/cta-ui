import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import { compile } from 'path-to-regexp'
import { deleteUnchangedValue } from './../../utils/form'

import { Modal, message } from 'antd'
import CourseForm from './../../components/Course.form'

const EDIT_COURSE = (
    gql`
        mutation ($course: CourseUpdateInput!, $id: Int!) {
            courseUpdate(course: $course, id: $id) {
                title
                description
                seoLink
                image{
                    response
                    status
                    uid
                    url
                }
                educatorId
            }
        }
    `
)

const EditCourse = props => {
    const [editCourse, { loading }] = useMutation(EDIT_COURSE)
    const { state } = useContext(Localize)

    const onSubmit = async values => {
        try{
            const image = {
                url: values.image.url,
                uid: values.image.uid,
                response: values.image.response,
                status: values.image.status
            }
            
            delete values.image.xhr
            values.image = image
            values = await deleteUnchangedValue(props.course, values)

            await editCourse({ variables: { course: values, id: props.course.id }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.refetch()
            props.history.push(compile('/educator/panel/course/:seoLink')({ seoLink: values.seoLink ? values.seoLink : props.course.seoLink }))
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Modal
            title={state.translation['Edit Course']}
            visible
            className="modal-action"
            width="80%"
            footer={null}
            onCancel={props.modalClose}
        >
            <CourseForm onSubmit={onSubmit} loading={loading} initialValues={props.course} />
        </Modal>
    )

}

export default EditCourse