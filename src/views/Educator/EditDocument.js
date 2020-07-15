import React, { useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import { deleteUnchangedValue } from './../../utils/form'

import { Modal, message } from 'antd'
import DocumentForm from './../../components/Document.form'
import { Redirect } from 'react-router-dom'

const EDIT_DOCUMENT = (
    gql`
        mutation ($document: DocumentUpdateInput!, $id: Int!) {
            documentUpdate(documentObj: $document, id: $id) {
                id
                title
            }
        }
    `
)


const DOCUMENT_READ = (
    gql`
        query($id: Int!){
            documentRead(id: $id){
                id
                title
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
    const [editDocument, { loadingMutation }] = useMutation(EDIT_DOCUMENT)
    const { state } = useContext(Localize)
    const { loading, data } = useQuery(DOCUMENT_READ, { variables: { id: parseInt(props.match.params.document_id) }, fetchPolicy: "network-only" })

    const onSubmit = async values => {
        try{
            if(values.codes){
                values.codes = values.codes.map(x => {
                    if(typeof(x) === 'string')
                        return {
                            code: x,
                            language: values.language
                        }
                    else
                        return {
                            ...x,
                            language: values.language
                        }
                })
            }

            values = await deleteUnchangedValue(data.documentRead, values)

            await editDocument({ variables: { document: { ...values, language: values.language || data.documentRead.language }, id: parseInt(props.match.params.document_id) }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.modalClose()
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    if(loading) return null

    else if(!data.documentRead){
        message.error('document not found')
        return <Redirect to="/educator/panel" />
    }else{
        return (
            <Modal
                title={state.translation['Add a New Section']}
                visible
                className="modal-action"
                width="80%"
                footer={null}
                onCancel={props.modalClose}
            >
                <DocumentForm onSubmit={onSubmit} loading={loadingMutation} initialValues={data.documentRead} />
            </Modal>
        )
    }
}

export default EditCourse