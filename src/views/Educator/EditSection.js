import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import { deleteUnchangedValue } from './../../utils/form'

import { Modal, message } from 'antd'
import SectionForm from './../../components/Section.form'

const EDIT_SECTION = (
    gql`
        mutation ($courseSection: CourseSectionUpdateInput, $id: Int!) {
            courseSectionUpdate(courseSection: $courseSection, id: $id) {
                id
                title
                description
                createdAt
                updatedAt
            }
        }
    `
)

const EditCourse = props => {
    const [editSection, { loading }] = useMutation(EDIT_SECTION)
    const { state } = useContext(Localize)

    const onSubmit = async values => {
        try{
            values = await deleteUnchangedValue(props.courseSection, values)
            await editSection({ variables: { courseSection: values, id: parseInt(props.match.params.id) }})

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
            <SectionForm onSubmit={onSubmit} loading={loading} initialValues={props.courseSection} />
        </Modal>
    )

}

export default EditCourse