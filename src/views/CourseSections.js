import React, { useContext } from 'react'
import Localize from './../global/Localize'
import { compile } from 'path-to-regexp'
import moment from 'moment'

import { List, message } from 'antd'
import { AiOutlineApartment, AiOutlineFileProtect, AiOutlineCheckCircle } from 'react-icons/ai'
import { FaInbox } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const CourseSections = props => {
    const { state } = useContext(Localize)

    const onClickAction = (key, id) => {
        props.history.push(compile('/course/:seoLink/section/:id/')({ seoLink: props.match.params.seoLink, id: id })+key)
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
                            key="count-document"
                            onClick={() => onClickAction("", item.id)}
                        >
                            <AiOutlineFileProtect
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation.document_count} : { item.documents ? item.documents.length : 0 }
                        </span>,
                        <span
                            key="completed"
                        >
                            <AiOutlineCheckCircle
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation['Completed']} : { item.documents ? item.documents.filter(x => x.documentUser && x.documentUser.isCompleted).length : 0 }
                        </span>
                    ]}
                    extra={
                        <span>
                            <span style={{ fontWeight: 600 }}> {state.translation.updatedAt}</span> <br /> {moment(item.updatedAt).format('DD MMMM YYYY HH:mm')}
                        </span>
                    }
                >
                    <List.Item.Meta
                        title={<Link to={`/course/${props.match.params.seoLink}/section/${item.id}`} >{item.title}</Link>}
                        description={item.description}
                    />
                </List.Item>
                )}
            />
    )

}

export default CourseSections

