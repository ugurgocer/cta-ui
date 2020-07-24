import React, { useContext } from 'react'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { compile } from 'path-to-regexp'

import { Card, List, Col, Row, Avatar, Statistic } from 'antd'
import { MdLibraryBooks } from 'react-icons/md'
import { FaBookReader, FaFileAlt } from 'react-icons/fa'

const EDUCATOR = (
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
                report {
                    totalCourse
                    totalDocument
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
const EducatorProfile = props => {
    const { state } = useContext(Localize)
    const { data, loading } = useQuery(EDUCATOR, { variables: { username: props.match.params.username }, fetchPolicy: "network-only" })

    if (loading) return null
    else{
        console.log(data)
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
                                style={{ fontSize: 16}}
                            >
                            <MdLibraryBooks
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                            {state.translation.courses}
                        </span>}
                        bordered
                        grid={{
                            gutter: 16,
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 2,
                            xl: 2,
                            xxl: 3
                        }}
                        style={{
                            backgroundColor: "#f4f4f4",
                            borderColor: '#f4f4f4',
                            marginBottom: 16
                        }}
                        pagination={{ total: data.educatorRead.courses.length, showTotal: (total, range) => `${state.translation['Total Course Count']}: ${total}`, pageSize: 5 }}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                    style={{ cursor: "pointer", width: "100%", marginTop: 16 }}
                                    bodyStyle={{ padding: 16 }}
                                    onClick={() => props.history.push(compile('/course/:seoLink')({ seoLink: item.seoLink }))}
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
                    <div className="site-statistic-demo-card" >
                        <Row gutter={50}>
                            <Col xs={24} lg={12} style={{ marginBottom: 16 }}>
                                <Card headStyle={{textAlign:'center'}}>
                                    <Statistic
                                        style={{ textAlign:'center' }}
                                        title={state.translation['Number Of Course']}
                                        value={data.educatorRead.report.totalCourse}
                                        valueStyle={{ color: '#3f8600' }}
                                        prefix={<FaBookReader/>}
                                        headStyle={{textAlign:'center'}}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}  style={{ marginBottom: 16 }}>
                                <Card>
                                    <Statistic
                                        style={{textAlign:'center'}}
                                        title={state.translation['Number Of Document']}
                                        value={data.educatorRead.report.totalDocument}
                                        valueStyle={{ color: 'blue' }}
                                        prefix={<FaFileAlt />}
                                    />
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        )
    }

}

export default EducatorProfile

