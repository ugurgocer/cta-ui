import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import Session from '../global/Session'
import gql from 'graphql-tag'

import { Card, Drawer, Button, Avatar, message } from 'antd'

const LOGOUT = (
    gql`
        mutation {
            logout
        }
    `
)

const RightDrawer = props => {
    const { state: session, dispatch: sessionDispatch } = useContext(Session)

    const [ logout, { loading } ] = useMutation(LOGOUT)

	return (
        <Drawer
            placement="right"
            zIndex={2000}
            visible={props.rightPanelOpen}
            onClose={() => props.onRightPanelOpen(false)}
        >
            <Card
                style={{ width: "100%" }}
                bordered={false}
            >
                <Card.Meta
                    avatar={<Avatar src="" size="large" />}
                    title={session.user.fullName}
                    description={session.user.username}
                    style={{ marginBottom: 10 }}
                />
                <Button
                    onClick={() => {
                        logout().then(x => {
                            sessionDispatch({ type:'logout' })
                            props.onLogout()
                        }).catch(err => {
                            message.error({ content: err.message })
                        })
                    }}
                    disabled={loading}
                    style={{ width: "100%", backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" }}
                > Çıkış Yap </Button>
            </Card>
        </Drawer>
    )
}

export default RightDrawer