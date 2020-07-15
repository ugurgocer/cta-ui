import React, { useContext } from 'react'
import Localize from './../../global/Localize'
import { useMutation } from '@apollo/react-hooks'
import { compile } from 'path-to-regexp'
import moment from 'moment'
import gql from 'graphql-tag'

import { Popconfirm, List, message } from 'antd'
import { AiFillEdit, AiFillDelete, AiOutlineApartment, AiOutlineFileProtect } from 'react-icons/ai'
import { FaInbox } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const DELETE_SECTION = (
    gql`
        mutation ($id: Int!) {
            courseSectionDelete(id: $id) {
                course_section_id
            }
        }
    `
)

const CourseSections = props => {
    const { state } = useContext(Localize)
    const [ mutate ] = useMutation(DELETE_SECTION)

    const onClickAction = (key, id) => {
        props.history.push(compile('/educator/panel/course/:seoLink/section/:id/')({ seoLink: props.match.params.seoLink, id: id })+key)
    }

    const deleteSection = async id => {
        try{
            await mutate({ variables: { id }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.refetch()
        }catch(err){
            message.error({ content: err.message })
        }
    }

    return (
        <List
            itemLayout="vertical"
            bordered
            header={<span
                style={{ fontSize: 16 }}
            >
                <AiOutlineApartment
                    size={18}
                    style={{ verticalAlign: "middle", marginRight: 8 }}
                />
                {state.translation.sections}
            </span>}
            locale={{ emptyText: (
                <span>
                    <FaInbox
                        size={50}
                        style={{ verticalAlign: "middle", marginRight: 8 }}
                    /><br/>
                    {state.translation['No section added for this course']}
                </span>
            )}}
            dataSource={props.courseSections}
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
                        </Popconfirm>,
                        <span
                            key="create-document"
                            onClick={() => onClickAction("create-document", item.id)}
                        >
                            <AiOutlineFileProtect
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation.create_document}
                        </span>,
                        <span
                            key="count-document"
                            onClick={() => onClickAction("", item.id)}
                        >
                            <AiOutlineFileProtect
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation.document_count} : { item.documents ? item.documents.length : 0 }
                        </span>
                    ]}
                    extra={
                        <span>
                            <span style={{ fontWeight: 600 }}> {state.translation.updatedAt}</span> <br /> {moment(item.updatedAt).format('DD MMMM YYYY HH:mm')}
                        </span>
                    }
                >
                    <List.Item.Meta
                        title={<Link to={`/educator/panel/course/${props.match.params.seoLink}/section/${item.id}`} >{item.title}</Link>}
                        description={item.description}
                    />
                </List.Item>
                )}
            />
    )

}

export default CourseSections

