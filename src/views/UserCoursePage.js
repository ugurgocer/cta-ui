import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import moment from 'moment'
import { compile } from 'path-to-regexp'

import { Card, Divider, message } from 'antd'
import { Switch, Route, Redirect } from 'react-router-dom'
import CourseSections from './CourseSections'
import DocumentList from './DocumentList'
import CodePage from './CodePage'

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
                isPublished
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
                    documents {
                        id
                        documentUser {
                            isCompleted
                        }
                    }
                }
            }
        }
    `
)

const UserCoursePage = props => {
    const { loading, data, refetch } = useQuery(COURSE_READ, { variables: { seoLink: props.match.params.seoLink }, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)

    const modalClose = () => {
        refetch()
        props.history.push(compile('/course/:seoLink')({ seoLink: props.match.params.seoLink }))
    }

    if(loading) return null
    else if(!data.courseRead){
        message.error('course not found')
        return <Redirect to="/educator/panel" />
    }else{
        return (
                <Switch>
                    <Route
                        exact
                        path="/course/:seoLink"
                        render={ props => (
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
                                
                            </Card>
                        )}
                    />
                    <Route
                        exact
                        path="/course/:seoLink/section/:id"
                        render={ props => {
                            const id = parseInt(props.match.params.id)
                            return <DocumentList
                                sectionId={id}
                                modalClose={modalClose}
                                refetch={refetch}
                                {...props}
                            />
                        }}
                    />
                    <Route
                        exact
                        path="/course/:seoLink/section/:id/document/:document_id"
                        render={ props => {
                            const id = parseInt(props.match.params.id)
                            const document_id = parseInt(props.match.params.document_id)
                            const courseSection = data.courseRead.courseSections.find(x => x.id === id)
                            return <CodePage
                                sectionId={id}
                                documentId={document_id}
                                documents={courseSection.documents.filter(x => x.id > document_id).sort((a, b) => a.id - b.id)}
                                refetch={refetch}
                                goBack={modalClose}
                                {...props}
                            />
                        }}
                    />
                </Switch>
        )
    }
}

export default UserCoursePage