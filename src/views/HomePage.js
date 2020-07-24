import React, { useContext } from 'react'
import { Card, Col, Row, Statistic, List } from 'antd'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import { FaFileAlt, FaBookReader, FaChalkboardTeacher } from 'react-icons/fa'
import { compile } from 'path-to-regexp'

const REPORT_QUERY = (
    gql`
        query($sorting: CourseSorting){
            report {
                totalCourse
                totalDocument
                totalEducator
            }

            educatorList{
                educators {
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
                }
            }

            courseList(sorting: $sorting){
                courses{
                    title
                    description
                    seoLink
                    isPublished
                    image{
                        url
                    }
                }
            }
        }
    `
)


const HomePage = props => {
    const { data, loading } = useQuery(REPORT_QUERY, { variables: { sorting: { type: 'DESC', field: 'updatedAt'  }}, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)

    if (loading) return null
    else {
        return (
            <div className="site-statistic-demo-card" >
                <Row gutter={50}>
                    <Col xs={24} lg={8} style={{ marginBottom: 16 }}>
                        <Card headStyle={{textAlign:'center'}}>
                            <Statistic
                                style={{ textAlign:'center' }}
                                title={state.translation['Total Course Count']}
                                value={data.report.totalCourse}
                                valueStyle={{ color: '#3d3d3d' }}
                                prefix={<FaBookReader style={{ verticalAlign: "middle", marginRight: 16 }} />}
                                headStyle={{textAlign:'center' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}  style={{ marginBottom: 16 }}>
                        <Card>
                            <Statistic
                                style={{textAlign:'center'}}
                                title={state.translation['Total Document Count']}
                                value={data.report.totalDocument}
                                valueStyle={{ color: '#5530a1' }}
                                prefix={<FaFileAlt style={{ verticalAlign: "middle", marginRight: 16 }} />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}  style={{ marginBottom: 16 }}>
                        <Card>
                            <Statistic
                                style={{textAlign:'center'}}
                                title={state.translation['Total Educator Count']}
                                value={data.report.totalEducator}
                                valueStyle={{ color: '#4b8fe0' }}
                                prefix={<FaChalkboardTeacher style={{ verticalAlign: "middle", marginRight: 16 }} />}
                            />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <List
                            header={state.translation['Educators with the most courses']}
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 6,
                            }}
                            bordered
                            dataSource={data.educatorList.educators.sort((a, b) => (b.report.totalDocument + b.report.totalCourse) - (a.report.totalDocument + a.report.totalCourse)).slice(0, 5)}
                            id="educators"
                            renderItem={item => (
                                <List.Item style={{ width: "100%" }}>
                                    <Card
                                        style={{ width: 200, cursor: "pointer", margin: "10px auto"}}
                                        bodyStyle={{ padding: 16 }}
                                        cover={
                                            <img
                                                alt={item.username}
                                                src={item.profilePicture.url}
                                            />
                                        }
                                        className="home-page-educator"
                                        headStyle={{ backgroundColor: '#000' }}
                                        title={item.name}
                                        onClick={() => props.history.push(compile('/educator/:username')({ username: item.username }))}
                                    >
                                        <Card.Meta
                                            description={item.description}
                                            title={item.username}
                                        />
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={24} style={{ marginTop: 16 }}>
                        <List
                            header={state.translation['Recently added courses']}
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 2,
                                md: 4,
                                lg: 4,
                                xl: 6,
                            }}
                            bordered
                            dataSource={data.courseList.courses}
                            id="home-page-courses"
                            pagination={{ total: data.courseList.courses.length, showTotal: (total, range) => `${state.translation['Total Course Count']}: ${total}`, pageSize: 6 }}
                            renderItem={item => (
                                <List.Item style={{ width: "100%" }}>
                                    <Card
                                        style={{ width: 200, cursor: "pointer", margin: "10px auto"}}
                                        bodyStyle={{ padding: 16 }}
                                        cover={
                                            <img
                                                alt={item.title}
                                                src={item.image.url}
                                            />
                                        }
                                        className="home-page-educator"
                                        headStyle={{ backgroundColor: '#000' }}
                                        title={item.name}
                                        onClick={() => props.history.push(compile('/course/:seoLink')({ seoLink: item.seoLink }))}
                                    >
                                        <Card.Meta
                                            description={item.description}
                                            title={item.title}
                                        />
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default HomePage