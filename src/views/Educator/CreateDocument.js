import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'

import { Modal, message } from 'antd'
import DocumentForm from './../../components/Document.form'

const ADD_DOCUMENT = (
    gql`
        mutation ($document: DocumentCreateInput!, $sectionId: Int!) {
            documentCreate(document:$document, sectionId: $sectionId) {
                id
                document
                language
                educatorId
                sectionId
                createdAt
                updatedAt
                codes{
                    code
                }
            }
        }
    `
)

const EditCourse = props => {
    const [createDocument, { loading }] = useMutation(ADD_DOCUMENT)
    const { state } = useContext(Localize)

    const onSubmit = async values => {
        try{
            if(values.codes){
                values.codes = values.codes.map(x => ({
                    code: x,
                    language: values.language
                }))
            }

            await createDocument({ variables: { sectionId: props.sectionId , document: values }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.modalClose()
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Modal
            title={state.translation.create_document}
            visible
            className="modal-action"
            width="80%"
            footer={null}
            onCancel={props.modalClose}
        >
            <DocumentForm onSubmit={onSubmit} loading={loading} />
        </Modal>
    )

}

export default EditCourse