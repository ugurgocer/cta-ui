import React, { useContext } from 'react'
import Localize from './../global/Localize'
import Session from './../global/Session'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'

import { Layout, Menu, Breadcrumb, Row, Col, Avatar, message } from 'antd'
import SearchBox from '../components/SearchBox'
import { Redirect } from 'react-router-dom'

import { FaChalkboardTeacher, FaRegUserCircle } from 'react-icons/fa'
import { BsFillGridFill, BsFillStarFill } from 'react-icons/bs'

import '../asset/layout.css'

const { Header, Content, Footer } = Layout

const header_layout = {
    logo: {
        xs: 7,
        sm: 6,
        md: 6,
        lg: 4,
        xl: 3,
        id: "logo"
    },
    menu: {
        xs: 0,
        sm: 0,
        md: 0,
        lg: 10,
        xl: 8,
        id: "menu"
    },
    search: {
        xs: 10,
        sm: 10,
        md: 10,
        lg: 8,
        xl: 10,
        id: "search"
    },
    be_educator: {
        xs: 0,
        sm: 0,
        md: 4,
        lg: 0,
        xl: 0,
        id: "be_educator"
    }, 
    user: {
        xs: 4,
        sm: 4,
        md: 2,
        lg: 2,
        xl: 2,
        id: "user"
    }
}

const TOKEN_READ = (
    gql`
        {
            tokenRead{
                token
                date
                expiryDate
                loginType
            }
        }
    `
)

const Main = props => {
    const { state } = useContext(Localize)
    const { state: session, dispatch: sessionDispatch } = useContext(Session)
    const { loading, error, data } = useQuery(TOKEN_READ)

    if (loading) return null
    if (error){
        sessionDispatch({ type: 'logout' })
        message.error({ content: error.message })
        return <Redirect to="/login" />
    }
    if(moment() > moment(data.tokenRead.expiryDate)){
        sessionDispatch({ type: 'logout' })
        return <Redirect to="/login" />
    }else
        if(session.token)
            sessionDispatch({ type: 'login', session: data.tokenRead })
    
    const menu = (
        <Menu theme="light" mode="horizontal">
            <Menu.Item key="1" icon={<FaChalkboardTeacher size={18} style={{ verticalAlign: "middle", marginRight: 8 }}/>}>{state.translation.educators}</Menu.Item>
            <Menu.Item key="2" icon={<BsFillGridFill size={18} style={{ verticalAlign: "middle", marginRight: 8 }}/>}>{state.translation.categories}</Menu.Item>
            <Menu.Item key="3" icon={<BsFillStarFill size={18} style={{ verticalAlign: "middle", marginRight: 8 }}/>}>{state.translation.trends}</Menu.Item>
        </Menu>
    )

    return (
        <Layout hasSider={false}>
            <Header>
                <Row gutter={16} id="header">
                    <Col {...header_layout.logo}>
                        <div className="logo" />
                    </Col>
                    <Col {...header_layout.menu}>
                    {menu}
                    </Col>
                    <Col {...header_layout.search}>
                        <SearchBox style={{ width: "100%", position: "relative" }} />
                    </Col>
                    <Col {...header_layout.be_educator}>
                        <Menu theme="light" mode="horizontal">
                            <Menu.Item key="1">{state.translation['Be educator']}</Menu.Item>
                        </Menu>
                    </Col>
                    <Col {...header_layout.user}>
                        <Avatar shape="circle" size="large" style={{ backgroundColor: "#fff" }} icon={<FaRegUserCircle size={40} color="#3d3d3d"/>} />
                    </Col>
                </Row>
            </Header>
            <Content className="site-layout" style={{ marginTop: 64 }}>
            <Breadcrumb style={{ margin: '16px 50px' }}>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item>List</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: '16px 50px', minHeight: 380 }}>
                Content
            </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Code Training App ©2020 Created by Uğur Güçer</Footer>
        </Layout>
    )

}

export default Main