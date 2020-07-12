import React, { useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import moment from 'moment'
import { compile } from 'path-to-regexp'

import { Card, Divider, Popconfirm, message } from 'antd'
import { AiFillEdit, AiFillFileAdd, AiFillDelete } from 'react-icons/ai'
import { Switch, Route } from 'react-router-dom'
import Edit from './EditCourse'

const COURSE_READ = (
    gql`
        query($seoLink: String!){
            courseRead(seoLink: $seoLink){
                courseId
                title
                description
                educatorId
                seoLink
                createdAt
                updatedAt
                image{
                    response
                    status
                    uid
                    url
                }
            }
        }
    `
)

const DELETE_COURSE = (
    gql`
        mutation ($id: Int!) {
            courseDelete(id: $id) {
                course_id
            }
        }
    `
)

const Course = props => {

    const { loading, data } = useQuery(COURSE_READ, { variables: { seoLink: props.match.params.seoLink }, fetchPolicy: "network-only" })
    const [ mutate ] = useMutation(DELETE_COURSE)
    const { state } = useContext(Localize)
    
    const deleteCourse = async () => {
        try{
            await mutate({ variables: { id: data.courseRead.courseId }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            props.history.push('/educator/panel/my/courses')
        }catch(err){
            message.error({ content: err.message })
        }
    }

    const onClickAction = key => {
        props.history.push(compile('/educator/panel/course/:seoLink/')({ seoLink: props.match.params.seoLink })+key)
    }

    const modalClose = () => {
        props.history.push(compile('/educator/panel/course/:seoLink')({ seoLink: props.match.params.seoLink }))
    }

    if(loading) return null

    return (
        <Card
            loading={loading}
            title={
                <span>
                    <span>    
                        {data.courseRead.title}
                    </span>
                </span>
            }
        >
        <Card
            actions={[
                <span
                    className="card-actions"
                    key="edit"
                    onClick={() => onClickAction("edit")}
                >
                    <AiFillEdit
                        size={18}
                        style={{ verticalAlign: "middle", marginRight: 8 }}
                    />
                    {state.translation.edit}
                </span>,
                <span
                    className="card-actions"
                    key="add-section"
                    onClick={() => onClickAction("add-section")}
                >
                    <AiFillFileAdd
                        size={18}
                        style={{ verticalAlign: "middle", marginRight: 8 }}
                    />
                    {state.translation['Add a New Section']}
                </span>,
                <Popconfirm
                    title={state.translation.messages["Are you sure delete this course?"]}
                    onConfirm={deleteCourse}
                    okText={state.translation.yes}
                    key="delete"
                    cancelText={state.translation.no}
                >
                    <span
                        className="card-actions"
                    >
                        <AiFillDelete
                            size={18}
                            style={{ verticalAlign: "middle", marginRight: 8 }}
                        />
                        {state.translation.delete}
                    </span>
                </Popconfirm>
            ]}
        >
            <Card.Meta
                avatar={
                    <img
                        alt={data.courseRead.title}
                        src={data.courseRead.image.url}
                        className="picture-in-table"
                    />
                }
                title={data.courseRead.title}
                description={
                    <span>
                        {data.courseRead.description}
                        <Divider style={{ margin: '10px 0' }}/>
                        {state.translation.createdAt}: {moment(data.courseRead.createdAt).format('DD MMMM YYYY HH:mm')}<br/>
                        {state.translation.updatedAt}: {moment(data.courseRead.updatedAt).format('DD MMMM YYYY HH:mm')}
                    </span>
                }
            />
        </Card>
        <Switch>
            <Route path="/educator/panel/course/:seoLink/edit" render={props => <Edit course={data.courseRead} modalClose={modalClose} {...props}/>}  />
        </Switch>
      </Card>
    )

}

export default Course