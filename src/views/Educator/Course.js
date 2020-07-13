import React, { useContext } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import Session from './../../global/Session'
import moment from 'moment'
import { compile } from 'path-to-regexp'

import { Card, Divider, Popconfirm, message, } from 'antd'
import { AiFillEdit, AiFillFileAdd, AiFillDelete } from 'react-icons/ai'
import { Switch, Route, Redirect } from 'react-router-dom'
import Edit from './EditCourse'
import AddSection from './AddSection'
import CourseSections from './CourseSections'
import EditSection from './EditSection'

const COURSE_READ = (
    gql`
        query($seoLink: String!){
            courseRead(seoLink: $seoLink){
                id
                title
                description
                educatorId
                seoLink
                createdAt
                updatedAt
                image{
                    url
                    uid
                    response
                    status
                }
                courseSections{
                    id
                    title
                    description
                    createdAt
                    updatedAt
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

    const { loading, data, refetch } = useQuery(COURSE_READ, { variables: { seoLink: props.match.params.seoLink }, fetchPolicy: "network-only" })
    const [ mutate ] = useMutation(DELETE_COURSE)
    const { state } = useContext(Localize)
    const { state: session } = useContext(Session)

    const deleteCourse = async () => {
        try{
            await mutate({ variables: { id: data.courseRead.id }})

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
        refetch()
        props.history.push(compile('/educator/panel/course/:seoLink')({ seoLink: props.match.params.seoLink }))
    }

    if(loading) return null
    else if(!data.courseRead){
        message.error('course not found')
        return <Redirect to="/educator/panel" />
    }else{
        if(data.courseRead.educatorId !== session.educator.educatorId ){
            return <Redirect to="/educator/panel" />
        }else{
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
                        style={{ marginBottom: 16 }}
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
                                    <span style={{ fontWeight: 600 }}>{state.translation.createdAt}</span>: {moment(data.courseRead.createdAt).format('DD MMMM YYYY HH:mm')}<br/>
                                    <span style={{ fontWeight: 600 }}>{state.translation.updatedAt}</span>: {moment(data.courseRead.updatedAt).format('DD MMMM YYYY HH:mm')}
                                </span>
                            }
                        />
                    </Card>
                    <CourseSections courseSections={data.courseRead.courseSections} refetch={refetch} {...props} />
                    <Switch>
                        <Route
                            path="/educator/panel/course/:seoLink/edit"
                            render={ props => <Edit course={data.courseRead} modalClose={modalClose} refetch={refetch} {...props}/>}
                        />
                        <Route
                            path="/educator/panel/course/:seoLink/add-section"
                            render={ props => <AddSection courseId={data.courseRead.id} modalClose={modalClose} refetch={refetch} {...props}/>}
                        />
                        <Route
                            path="/educator/panel/course/:seoLink/section/:id/edit"
                            render={ props => {
                                console.log(data.courseRead.courseSections)
                                const id = parseInt(props.match.params.id)
                                return <EditSection
                                    courseSection={data.courseRead.courseSections.find(x => x.id === id)}
                                    courseId={data.courseRead.id}
                                    modalClose={modalClose}
                                    refetch={refetch}
                                    {...props}
                                />
                            }}
                        />
                    </Switch>
                </Card>
            )
        }
    }
}

export default Course