import React, { useContext } from 'react'
import Localize from './../global/Localize'

import { Layout, Menu, Card, Avatar, Col, Row, Divider } from 'antd'
import { Link, Switch, Route } from 'react-router-dom'
import TextEditor from '../components/Course.form'

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

    console.log('d')
    const menu = (
        <div>
            <Card
                style={{ width: "100%" }}
                bordered={false}
                key="sf"
            >
                <Card.Meta
                    avatar={<Avatar src="" size="large" />}
                    title="fsdf"
                    key="fsfsf"
                />
            </Card>
            <Divider type="horizontal" />
            <Menu
                mode="inline"
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
                    <Layout.Sider className="site-layout-background" style={{
                        boxShadow: "0 0 1px 1px rgba(20,23,28,.1), 0 3px 1px 0 rgba(20,23,28,.1)",
                        zIndex: 100,
                        position: "fixed",
                        left: 0,
                        marginTop: -16
                    }}>
                        {menu}
                    </Layout.Sider>
                </Col>
                <Col {...grid_layout.content}>
                    <Content style={{ padding: '0 24px' }}>
                        <div>
                            <Switch>
                                <Route path="/educator/panel/create/course" component={TextEditor} />			
                            </Switch>
                        </div>
                    </Content>
                </Col>
            </Row>
        </Layout>
    )

}

export default EducatorPanel