import React, { useContext, useState } from 'react'
import Localize from './../global/Localize'
import Session from './../global/Session'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import moment from 'moment'
import "moment/min/locales.min"

import { Layout, Menu, Row, Col, Avatar } from 'antd'
import SearchBox from '../components/SearchBox'
import { Redirect, Link, Switch, Route } from 'react-router-dom'
import EducatorPanel from './EducatorPanel'
import BeEducator from './BeEducator'
import RightDrawer from './RightDrawer'

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
                userId
                user {
                    fullName
                    username
                    email
                    isEducator
                }
            }
            meEducatorInfo{
                educatorId
                name
                username
                description
                profilePicture{
                    url
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

    if(!session.token || !session.educator){
        sessionDispatch({ type: 'login', session: data.tokenRead, educator: data.meEducatorInfo })

        return null
    }else{

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
                            <Link to="/"><div className="logo" /></Link>
                        </Col>
                        <Col {...header_layout.menu}>
                        {menu}
                        </Col>
                        <Col {...header_layout.search}>
                            <SearchBox style={{ width: "100%", position: "relative" }} />
                        </Col>
                        <Col {...header_layout.be_educator}>
                            <Menu theme="light" mode="horizontal">
                                <Menu.Item key="1"><Link to={session.loginType === 'EDUCATOR' ? '/educator/panel' : '/be-educator'}>{session.loginType === 'EDUCATOR' ? state.translation['Educator Panel'] : state.translation['Be educator']}</Link></Menu.Item>
                            </Menu>
                        </Col>
                        <Col {...header_layout.user}>
                            <Avatar shape="circle" size="default" style={{ backgroundColor: "#fff" }} icon={<FaRegUserCircle size={32} color="#3d3d3d"/>} onClick={() => onRightPanelOpen(!rightPanelOpen)} />
                        </Col>
                    </Row>
                </Header>
                <Content className="site-layout" style={{ marginTop: 64 }} >
                    <div className="site-layout-background" style={{ padding: '30px 50px', minHeight: 380,  }}>
                        <Switch>
                            <Route path="/educator/panel" component={EducatorPanel} />
                            <Route path="/be-educator" component={BeEducator} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Code Training App ©2020 Created by Uğur Güçer</Footer>
                <RightDrawer rightPanelOpen={rightPanelOpen} onRightPanelOpen={onRightPanelOpen} onLogout={() => props.history.push('/login')} />
            </Layout>
        )
    }

}

export default Main