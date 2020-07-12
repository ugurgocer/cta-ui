import React, { useContext } from 'react'
import Localize from './../global/Localize'
import Session from './../global/Session'

import { Layout, Menu, Card, Avatar, Col, Row, Divider } from 'antd'
import { Link, Switch, Route } from 'react-router-dom'
import CreateCourse from '../views/Educator/CreateCourse'
import MyCourses from '../views/Educator/MyCourses'
import Course from '../views/Educator/Course'
import { FaBook } from 'react-icons/fa'

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


const EducatorPanel = props => {
    const { state } = useContext(Localize)
    const { state: session } = useContext(Session)

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
                            <Route path="/educator/panel/create/course" component={CreateCourse} />
                            <Route path="/educator/panel/my/courses" component={MyCourses} />
                            <Route path="/educator/panel/course/:seoLink" component={Course} />
                        </Switch>
                    </Content>
                </Col>
            </Row>
        </Layout>
    )

}

export default EducatorPanel