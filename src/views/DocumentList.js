import React, { useContext } from 'react'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import { compile } from 'path-to-regexp'
import moment from 'moment'
import gql from 'graphql-tag'

import {  List, message, Modal } from 'antd'
import { Redirect } from 'react-router-dom'
import { FaInbox } from 'react-icons/fa'
import { AiOutlineCheckCircle, AiFillCaretRight } from 'react-icons/ai'
import { TiArrowLoop } from 'react-icons/ti'


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
                    documentUser {
                        isCompleted
                        code
                        output
                    }
                }
            }
        }
    `
)

const DocumentList = props => {
    const { loading, data } = useQuery(SECTION_READ, { variables: { id: props.sectionId }, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)

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
                            extra={
                                <span>
                                    <span style={{ fontWeight: 600 }}> {state.translation.updatedAt}</span> <br /> {moment(item.updatedAt).format('DD MMMM YYYY HH:mm')}
                                </span>
                            }
                            
                            actions={[
                                <span
                                    key="start"
                                    onClick={() => props.history.push(compile('/course/:seoLink/section/:id/document/:document_id')({ seoLink: props.match.params.seoLink, id: props.sectionId, document_id: item.id }))}
                                >
                                    {item.documentUser && item.documentUser.isCompleted ? (
                                        <TiArrowLoop
                                            size={18}
                                            style={{ verticalAlign: "middle", marginRight: 8 }}
                                        />
                                    ) : (
                                        <AiFillCaretRight
                                            size={18}
                                            style={{ verticalAlign: "middle", marginRight: 8 }}
                                        />
                                    )}
                                    {!(item.documentUser && item.documentUser.isCompleted) ? state.translation.start : state.translation.replay}
                                </span>,
                                ...(item.documentUser && item.documentUser.isCompleted ? [
                                    <span
                                        key="completed"
                                    >
                                        {state.translation['Completed']}
                                        <AiOutlineCheckCircle
                                            size={18}
                                            style={{ verticalAlign: "middle", marginLeft: 8 }}
                                        />
                                    </span>
                                ] : [])
                            ]}
                        >
                            <List.Item.Meta
                                title={item.title}
                                description={item.language}
                            />
                        </List.Item>
                    )}
                />
            </Modal>   
        )
    }
}

export default DocumentList

