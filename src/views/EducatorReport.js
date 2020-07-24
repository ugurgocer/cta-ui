import React, { useContext } from 'react'
import { Card, Col, Row, Statistic, List } from 'antd'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import Session from './../global/Session'
import { useQuery } from '@apollo/react-hooks'
import { FaFileAlt, FaBookReader } from 'react-icons/fa'
import { compile } from 'path-to-regexp'
import moment from 'moment'

const REPORT_QUERY = (
    gql`
        query($educatorId:Int!, $filter: CourseFilterBase, $sorting: CourseSorting, $paging: Paging){
            educatorcourseReport(educatorId: $educatorId) {
                totalCourse
                totalDocument
            }

            courseList(filter: $filter, sorting: $sorting, paging: $paging){
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


const EducatorReport = props => {
    const { state: session } = useContext(Session)

    const filter = {
        and: [
            { educatorId: { eq: props.isUser ? props.id : session.educator.id } }
        ]
    }

    const sorting = {
        field: 'createdAt',
        type: 'DESC'
    }

    const paging = {
        limit: 5
    }

    const { data, loading } = useQuery(REPORT_QUERY, { variables: { educatorId: props.id, sorting, filter, paging }, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)

    if (loading) return null
    else {
        return (
            <div className="site-statistic-demo-card" >
                <Row gutter={50}>
                    <Col xs={24} lg={12} style={{ marginBottom: 16 }}>
                        <Card headStyle={{textAlign:'center'}}>
                            <Statistic
                                style={{ textAlign:'center' }}
                                title={state.translation['Number Of Course']}
                                value={data.educatorcourseReport.totalCourse}
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
                                value={data.educatorcourseReport.totalDocument}
                                valueStyle={{ color: 'blue' }}
                                prefix={<FaFileAlt />}
                            />
                        </Card>
                    </Col>
                    <Col span={24} style={{ marginBottom: 16 }}>
                        {!props.isUser && <List
                            grid={{
                                gutter: 16,
                                xs: 1,
                                sm: 1,
                                md: 2,
                                lg: 3,
                                xl: 5,
                            }}
                            id="lastCourses"
                            header="En Son Eklenen 5 Kurs"
                            bordered
                            dataSource={data.courseList.courses}
                            renderItem={item => (
                                <List.Item>
                                    <Card
                                        style={{ width: 200, cursor: "pointer", margin: "10px auto" }}
                                        bodyStyle={{ padding: 16 }}
                                        cover={
                                            <img
                                                alt={item.title}
                                                src={item.image.url}
                                            />
                                        }
                                        title={item.name}
                                        onClick={() => props.history.push(compile('/educator/panel/course/:seoLink')({ seoLink: item.seoLink }))}
                                    >
                                        <Card.Meta
                                            description={item.description}
                                            title={item.title}
                                        />
                                    </Card>
                                    <span style={{ fontWeight: 400, color:'black' }}>{`${state.translation.createdAt}: `}</span>{moment(item.createdAt).format('DD-MM-YYYY')}
                                </List.Item>
                            )}
                        />}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default EducatorReport