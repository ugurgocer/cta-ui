import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'

import { Modal, message } from 'antd'
import SectionForm from './../../components/Section.form'

const ADD_SECTION = (
    gql`
        mutation ($courseSection: CourseSectionCreateInput!, $id: Int!) {
            courseSectionCreate(courseSection: $courseSection, courseId: $id) {
                id
                title
                description
                createdAt
                updatedAt
            }
        }
    `
)

const AddSection = props => {
    const [addSection, { loading }] = useMutation(ADD_SECTION)
    const { state } = useContext(Localize)

    const onSubmit = async values => {
        try{

            await addSection({ variables: { courseSection: values, id: props.courseId }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.modalClose()
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Modal
            title={state.translation['Add a New Section']}
            visible
            className="modal-action"
            width="80%"
            footer={null}
            onCancel={props.modalClose}
        >
            <SectionForm onSubmit={onSubmit} loading={loading} />
        </Modal>
    )

}

export default AddSection