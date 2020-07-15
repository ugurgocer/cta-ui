import React, { useContext } from 'react'
import Localize from './../../global/Localize'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { compile } from 'path-to-regexp'
import moment from 'moment'
import gql from 'graphql-tag'

import { Popconfirm, List, message, Modal } from 'antd'
import { AiFillEdit, AiFillDelete } from 'react-icons/ai'
import { Redirect, Route, Switch } from 'react-router-dom'
import { FaInbox } from 'react-icons/fa'
import EditDocument from './EditDocument'

const DELETE_DOCUMENT = (
    gql`
        mutation ($id: Int!) {
            documentDelete(id: $id) {
                document_id
            }
        }
    `
)

const SECTION_READ = (
    gql`
        query($id: Int!){
            courseSectionRead(id: $id){
                id
                title
                documents {
                    id
                    title
                    document
                    language
                    educatorId
                    sectionId
                    createdAt
                    updatedAt
                }
            }
        }
    `
)

const DocumentList = props => {
    const { loading, data, refetch } = useQuery(SECTION_READ, { variables: { id: props.sectionId }, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)
    const [ mutate ] = useMutation(DELETE_DOCUMENT)

    const onClickAction = (key, document_id) => {
        props.history.push(compile('/educator/panel/course/:seoLink/section/:id/document/:document_id/')({ seoLink: props.match.params.seoLink, id: props.sectionId, document_id })+key)
    }

    const modalClose = () => {
        refetch()
        props.history.push(compile('/educator/panel/course/:seoLink/section/:id')({ seoLink: props.match.params.seoLink, id: props.sectionId }))
    }

    const deleteSection = async id => {
        try{
            await mutate({ variables: { id }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            refetch()
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    if(loading) return null

    else if(!data.courseSectionRead){
        message.error('course section not found')
        return <Redirect to="/educator/panel" />
    }else{
        return (
            <Modal
                title={data.courseSectionRead.title}
                visible
                className="modal-action"
                width="80%"
                footer={null}
                onCancel={props.modalClose}
            >
                <List
                    itemLayout="vertical"
                    bordered
                    locale={{ emptyText: (
                        <span>
                            <FaInbox
                                size={50}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            /><br/>
                            {state.translation['No document added for this section']}
                        </span>
                    )}}
                    dataSource={data.courseSectionRead.documents}
                    renderItem={item => (
                        <List.Item
                            key={item.title}
                            actions={[
                                <span
                                    key="edit"
                                    onClick={() => onClickAction("edit", item.id)}
                                >
                                    <AiFillEdit
                                        size={18}
                                        style={{ verticalAlign: "middle", marginRight: 8 }}
                                    />
                                    {state.translation.edit}
                                </span>,
                                <Popconfirm
                                    title={state.translation.messages["Are you sure delete this course?"]}
                                    okText={state.translation.yes}
                                    onConfirm={() => deleteSection(item.id)}
                                    key="delete"
                                    cancelText={state.translation.no}
                                >
                                    <span>
                                        <AiFillDelete
                                            size={18}
                                            style={{ verticalAlign: "middle", marginRight: 8 }}
                                        />
                                        {state.translation.delete}
                                    </span>
                                </Popconfirm>
                            ]}
                            extra={
                                <span>
                                    <span style={{ fontWeight: 600 }}> {state.translation.updatedAt}</span> <br /> {moment(item.updatedAt).format('DD MMMM YYYY HH:mm')}
                                </span>
                            }
                        >
                            <List.Item.Meta
                                title={item.title}
                                description={item.language}
                            />
                        </List.Item>
                    )}
                />
                <Switch>
                    <Route
                        path="/educator/panel/course/:seoLink/section/:id/document/:document_id/edit"
                        render={ props => {
                            return <EditDocument
                                modalClose={modalClose}
                                refetch={refetch}
                                {...props}
                            />
                        }}
                    />
                </Switch>
            </Modal>   
        )
    }
}

export default DocumentList

