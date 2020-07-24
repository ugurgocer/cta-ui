import React, { useContext } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import { deleteUnchangedValue } from './../utils/form'
import { compile } from 'path-to-regexp'

import { message } from 'antd'
import CodePageComp from './../components/CodePage.component'
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

const SET_DOCUMENT_USER = (
    gql`
        mutation ($documentUser: DocumentUserInput, $documentId: Int!) {
            setDocumentUser(documentUser: $documentUser, documentId: $documentId) {
                isCompleted
                code
                output
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
                documentUser {
                    isCompleted
                    code
                    output
                }
            }
        }
    `
)

const CodePage = props => {
    const [editDocument, { loadingMutation }] = useMutation(EDIT_DOCUMENT)
    const [ onComplete ] = useMutation(SET_DOCUMENT_USER)
    const { state } = useContext(Localize)
    const { loading, data } = useQuery(DOCUMENT_READ, { variables: { id: parseInt(props.match.params.document_id) }, fetchPolicy: "network-only" })

    const stepOver = async (output, code) => {
        try{
            await onComplete({ variables: { documentUser: { output, code }, documentId: parseInt(props.match.params.document_id) }})

            if(props.documents.length){
                props.history.push(compile('/course/:seoLink/section/:id/document/:document_id')({ seoLink: props.match.params.seoLink, id: props.sectionId, document_id: Math.min(...props.documents.map(x => x.id)) }))
            }else{
                props.goBack()
            }
        }catch(err){
            message.error({ content: err.message })
        }
    }

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
            <CodePageComp onSubmit={onSubmit} loading={loadingMutation} document={data.documentRead} {...props} stepOver={stepOver} isLastElement={props.documents.length === 0} />
        )
    }
}

export default CodePage