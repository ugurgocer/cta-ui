import React, { useContext, useState } from 'react'
import Localize from './../global/Localize'
import Session from './../global/Session'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import { compile } from 'path-to-regexp'

import "moment/min/locales.min"

import { Layout, Menu, Row, Col, Avatar, Drawer } from 'antd'
import SearchBox from '../components/SearchBox'
import { Redirect, Link, Switch, Route } from 'react-router-dom'
import EducatorPanel from './EducatorPanel'
import EducatorProfile from './EducatorProfile'
import BeEducator from './BeEducator'
import RightDrawer from './RightDrawer'
import SearchCourse from './Search.course'
import Educators from './Educators'
import CoursePage from './UserCoursePage'

import { FaChalkboardTeacher, FaRegUserCircle, FaChalkboard } from 'react-icons/fa'
import { TiThMenu } from 'react-icons/ti'

import '../asset/layout.css'

const { Header, Content, Footer } = Layout

const header_layout = {
    logo: {
        xs: 7,
        sm: 6,
        md: 4,
        lg: 4,
        xl: 3,
        id: "logo"
    },
    mobileMenu: {
        xs: 3,
        sm: 3,
        md: 0,
        lg: 0,
        xl: 0,
    },
    menu: {
        xs: 0,
        sm: 0,
        md: 9,
        lg: 7,
        xl: 6,
        id: "menu"
    },
    search: {
        xs: 10,
        sm: 10,
        md: 9,
        lg: 10,
        xl: 11,
        id: "search"
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
                userId
                user {
                    fullName
                    username
                    email
                    isEducator
                }
            }
        }
    `
)

const Main = props => {
    const { state } = useContext(Localize)
    const { state: session, dispatch: sessionDispatch } = useContext(Session)
    const { loading, error, data } = useQuery(TOKEN_READ, { fetchPolicy: 'network-only' })
    const [ rightPanelOpen, onRightPanelOpen ] = useState(false) 
    const [ mobileMenu, openMobileMenu ] = useState(false) 

    const onSearch = value => {
        if(value !== '')
            props.history.push(compile('/search/course/:value')({ value }))
    }

    moment.locale(state.language)

    if (loading ) return null

    if (error){
        sessionDispatch({ type: 'logout' })
        return <Redirect to="/login" />
    }

    if(data && moment() > moment(data.tokenRead.expiryDate)){
        sessionDispatch({ type: 'logout' })
        return <Redirect to="/login" />
    }

    if(!session.token){
        sessionDispatch({ type: 'login', session: data.tokenRead })

        return null
    }else{
        const menu = (mode, close) => (
            <Menu theme="light" mode={mode}>
                <Menu.Item key="1" icon={<FaChalkboardTeacher size={18} style={{ verticalAlign: "middle", marginRight: 8 }}/>}><Link to="/educators" onClick={close}>{state.translation.educators}</Link></Menu.Item>
                <Menu.Item key="2" icon={<FaChalkboard size={18} style={{ verticalAlign: "middle", marginRight: 8 }}/>}><Link to={session.loginType === 'EDUCATOR' ? '/educator/panel' : '/be-educator'} onClick={close}>{session.loginType === 'EDUCATOR' ? state.translation['Educator Panel'] : state.translation['Be educator']}</Link></Menu.Item>
            </Menu>
        )

        return (
            <Layout hasSider={false}>
                <Header>
                    <Row gutter={16} id="header">
                        <Col {...header_layout.logo}>
                            <Link to="/"><div className="logo" /></Link>
                        </Col>
                        <Col {...header_layout.mobileMenu}>
                            <TiThMenu size={32} color="#5530a1" onClick={() => openMobileMenu(true)} style={{ verticalAlign: "middle", marginRight: 8, cursor: "pointer" }} />
                        </Col>
                        <Col {...header_layout.menu}>
                        {menu('horizontal')}
                        </Col>
                        <Col {...header_layout.search}>
                            <SearchBox onSearch={onSearch} style={{ width: "100%", position: "relative" }} />
                        </Col>
                        <Col {...header_layout.user}>
                            <Avatar shape="square" size="default" style={{ backgroundColor: "#fff" }} icon={<FaRegUserCircle size={32} color="#3d3d3d"/>} onClick={() => onRightPanelOpen(!rightPanelOpen)} />
                        </Col>
                    </Row>
                </Header>
                <Content className="site-layout" style={{ marginTop: 64, paddingBottom: 65 }} >
                    <div className="site-layout-background" style={{ padding: '30px 50px' }}>
                        <Switch>
                            <Route path="/educator/panel" component={EducatorPanel} />
                            <Route path="/be-educator" component={BeEducator} />
                            <Route path="/search/course/:value" component={SearchCourse} />
                            <Route path="/educators" component={Educators} />
                            <Route path="/educator/:username" component={EducatorProfile} />
                            <Route path="/course/:seoLink" component={CoursePage} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Code Training App ©2020 Created by Uğur Güçer</Footer>
                <RightDrawer rightPanelOpen={rightPanelOpen} onRightPanelOpen={onRightPanelOpen} onLogout={() => props.history.push('/login')} {...props}/>
                <Drawer
                    visible={mobileMenu}
                    onClose={() => openMobileMenu(false)}
                    width="100%"
                >
                    {menu('vertical', () => openMobileMenu(false))}
                </Drawer>
            </Layout>
        )
    }

}

export default Main