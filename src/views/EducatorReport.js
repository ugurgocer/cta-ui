import React, { useContext } from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import gql from 'graphql-tag'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import { FaUserGraduate, FaFileAlt, FaBookReader } from 'react-icons/fa'

const REPORT_QUERY = (
    gql`
        query($educatorId:Int!){
            educatorcourseReport(educatorId: $educatorId) {
                totalCourse
                totalStudent
                totalDocument
            }
        }
    `
)


const EducatorReport = props => {
    const { data, loading } = useQuery(REPORT_QUERY, { variables: { educatorId: props.id }, fetchPolicy: "network-only" })
    const { state } = useContext(Localize)

    if (loading) return null
    else {
        return (
            <div className="site-statistic-demo-card" >
                <Row justify="center" align="top" gutter={30}>
                    <Col xs={24} lg={8} style={{ marginBottom: 16 }}>
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
                    <Col xs={24} lg={8}  style={{ marginBottom: 16 }}>
                        <Card>
                            <Statistic
                                style={{textAlign:'center'}}
                                title={state.translation['Number Of Student']}
                                value={data.educatorcourseReport.totalStudent}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FaUserGraduate />}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}  style={{ marginBottom: 16 }}>
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
                </Row>
            </div>
        )
    }
}

export default EducatorReport