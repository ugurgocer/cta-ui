import React, { useContext } from 'react'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { compile } from 'path-to-regexp'

import { Card, List, Col, Row, Avatar } from 'antd'
import { MdLibraryBooks } from 'react-icons/md'
import Report from './EducatorReport'


const EDUCATOR_LIST = (
    gql`
        query($username: String!){
            educatorRead(username: $username) {
                id
                name
                username
                description
                profilePicture {
                    url
                    uid
                    response
                    status
                }
                courses {
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
                }
            }
        }
    `
)
const CourseSections = props => {
    const { state } = useContext(Localize)
    const { data, loading } = useQuery(EDUCATOR_LIST, { variables: { username: props.match.params.username }, fetchPolicy: "network-only" })

    if (loading) return null
    else{
        return (
            <Row gutter={16}>
                <Col xs={24} sm={24} md={8} lg={6} xl={4} >
                    <Card
                        style={{ cursor: "pointer", marginBottom: 16 }}
                        bodyStyle={{ padding: 16 }}
                        cover={
                            <img
                                alt={data.educatorRead.username}
                                src={data.educatorRead.profilePicture.url}
                            />
                        }
                        title={data.educatorRead.name}
                    >
                        <Card.Meta
                            description={data.educatorRead.description}
                            title={data.educatorRead.username}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={16} lg={18} xl={20}>
                    <List
                        dataSource={data.educatorRead.courses}
                        header={<span
                                style={{ fontSize: 16, padding: 3, paddingLeft: 16 }}
                            >
                            <MdLibraryBooks
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation.courses}
                        </span>}
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 2,
                            xl: 2,
                            xxl: 3
                        }}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    style={{ cursor: "pointer", width: "100%" }}
                                    bodyStyle={{ padding: 16 }}
                                    onClick={() => props.history.push(compile('/course/:username')({ username: item.seoLink }))}
                                >
                                
                                    <Card.Meta
                                        avatar={<Avatar src={item.image.url}  size={150} />}
                                        description={item.description}
                                        title={item.title}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                </Col>
                <Col span={24}>
                    <Report id={data.educatorRead.id} />
                </Col>
            </Row>
        )
    }

}

export default CourseSections

