import React, { useContext } from 'react'
import Localize from './../global/Localize'
import Session from './../global/Session'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { Layout, Menu, Card, Avatar, Col, Row, Divider } from 'antd'
import { Link, Switch, Route } from 'react-router-dom'
import CreateCourse from '../views/Educator/CreateCourse'
import MyCourses from '../views/Educator/MyCourses'
import Course from '../views/Educator/Course'
import UpdateInformation from '../views/Educator/UpdateInformation'
import { FaPencilAlt, FaBook } from 'react-icons/fa'
import EducatorReport from './EducatorReport'

import '../asset/layout.css'

const { Content } = Layout


const grid_layout = {
    sider: {    
        xs: 0,
        sm: 0,
        md: 0,
        lg: 4,
        xl: 2,
    },
    content: {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 20,
        xl: 22
    }
}

const EDUCATOR_INFO = (
    gql`
        {
            meEducatorInfo{
                educatorId
                name
                username
                description
                profilePicture {
                    url
                    uid
                    response
                    status
                }
            }
        }
    `
)


const EducatorPanel = props => {
    const { state } = useContext(Localize)
    const { state: session, dispatch: sessionDispatch } = useContext(Session)
    const { data, loading } = useQuery(EDUCATOR_INFO, { fetchPolicy: "network-only" })
    
    if(loading) return null

    if(!session.educator){
        sessionDispatch({ type: 'login', educator: data.meEducatorInfo, session })

        return null
    }else{
        const menu = (
            <div>
                <Card
                    style={{ width: "100%" }}
                    bordered={false}
                >
                    <Card.Meta
                        avatar={<Avatar src={session.educator.profilePicture.url} size="large" shape="circle" style={{ backgroundColor: '#fff' }}/>}
                        title={session.educator.name}
                        description={session.educator.username}
                    />
                </Card>
                <Divider type="horizontal" style={{ marginTop: 0, marginBottom: 5, borderColor: '#673ab7' }}/>
                <Menu
                    mode="inline"
                    theme="dark"
                    style={{ backgroundColor: " #5530a1", color: "#fff"}}
                >
    
                    <Menu.SubMenu
                        key="courses"
                        title={state.translation.course}
                        icon={<FaBook size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />}
                    >
                        <Menu.Item key="create-course" ><Link to="/educator/panel/create/course">{state.translation['Create a course']}</Link></Menu.Item>
                        <Menu.Item key="my-courses"><Link to="/educator/panel/my/courses">{state.translation['My courses']}</Link></Menu.Item>
                    </Menu.SubMenu>
                    
                    <Menu.Item
                     icon={<FaPencilAlt size={18} style={{ verticalAlign: "middle", marginRight: 8 }} />}
                     onClick={()=>{
                        props.history.push('/educator/panel/update')
                    }} key="update-informations"> {state.translation['Update My Informations']}</Menu.Item>
                </Menu>
            </div>
        )

        return (
            <Layout className="site-layout-background">
                <Row style={{ width: "100%" }}>
                    <Col {...grid_layout.sider}>
                        <Layout.Sider >
                            {menu}
                        </Layout.Sider>
                    </Col>
                    <Col {...grid_layout.content}>
                        <Content style={{ paddingLeft: 24 }}>
                            <Switch>
                                <Route path="/educator/panel/">
                                    <EducatorReport id={data.meEducatorInfo.educatorId} />
                                </Route>
                                <Route path="/educator/panel/create/course" component={CreateCourse} />
                                <Route path="/educator/panel/my/courses" component={MyCourses} />
                                <Route path="/educator/panel/course/:seoLink" component={Course} />
                                <Route path="/educator/panel/update">
                                    <UpdateInformation educator={data.meEducatorInfo} />
                                </Route>
                            </Switch>
                        </Content>
                    </Col>
                </Row>
            </Layout>
        )
    }

}

export default EducatorPanel    
