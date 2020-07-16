import React, { useContext } from 'react'
// import { useMutation, useQuery } from '@apollo/react-hooks'
import { useMutation } from '@apollo/react-hooks'
import { useQuery } from '@apollo/react-hooks'
import Session from '../global/Session'
import gql from 'graphql-tag'
import { Link, Route, Switch } from 'react-router-dom'
import Localize from './../global/Localize'
import UserUpdate from './UserUpdateForm'

import { Card, Drawer, Button, Avatar, message, Modal } from 'antd'

const LOGOUT = (
    gql`
        mutation {
            logout
        }
    `
)

const UPDATE_QUERY = (
    gql`
        mutation($userId:Int!, $user:UserDInput, $userDetail:UserDetailInput){
            setUserDetail(userId:$userId , user:$user,  userDetail:$userDetail) {
                userDetail{
                    userId
                    title
                    resume
                    website
                    twitter
                    facebook
                    linkedin
                    youtube
                        user{
                            fullName
                            username
                            email
                            isEducator
                        }
                }
            }
        }   
    `
)

const READ_QUERY = (
    gql`
    query($userId:Int!){
        getUserDetail(userId:$userId) {
            userDetail{
             userId
            title
            resume
            website
            twitter
            facebook
            linkedin
            youtube
            user{
                fullName
                username
                email
                isEducator
            }
        }
    }
    }
    `
)
const RightDrawer = props => {
    const { state: session, dispatch: sessionDispatch } = useContext(Session)
    const { state } = useContext(Localize)
    const [ updateMutation, { loadingMutation } ] = useMutation(UPDATE_QUERY)
    const { data, refetch } = useQuery(READ_QUERY, { variables: { userId: parseInt(props.id) }, fetchPolicy: "network-only" })

    const [logout, { loading }] = useMutation(LOGOUT)

    const modalClose = () => {
        props.history.push('/')
    }

    const openModal = () => {
        props.history.push('/user/update')
    }

    const onSubmit = async values => {
        let user = {
            fullName: values.fullName,
            username: values.username,
            email: values.email,
            password: values.password
        }
        let userDetail = {
            profilePicture: values.image,
            title: values.title,
            resume: values.resume,
            website: values.website,
            twitter: values.twitter,
            facebook: values.facebook,
            linkedin: values.linkedin,
            youtube: values.youtube
        }

        try{
            await updateMutation({ variables: { userDetail , user,  userId: parseInt(props.id) }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            modalClose()
            refetch()
        }catch(err){
            message.error({ content: err.message })
        }
    }

    const initialValues = async values => {

    }

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
                <span
                    id="1"
                    onClick={()=>{
                        props.onRightPanelOpen(false)   
                        openModal()
                    }}
                    style={{ marginLeft: 14, fontSize: 14, textDecoration: 'underline', cursor:'pointer' }}
                >
                    {state.translation['Edit My Informations']}
                </span>
         
                <Button
                    onClick={() => {
                        logout().then(x => {
                            sessionDispatch({ type: 'logout' })
                            props.onLogout()
                        }).catch(err => {
                            message.error({ content: err.message })
                        })
                    }}
                    disabled={loading}
                    style={{ width: "100%", backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff", marginTop:10 }}
                > Çıkış Yap </Button>
            </Card>
            <Switch>
                <Route
                    path="/user/update"
                    render={props => <Modal
                        title={state.translation['Edit My Informations']}
                        visible
                        centered
                        className="modal-action"
                        width="80%"
                        footer={null}
                        onCancel={modalClose}
                    >
                        <UserUpdate onSubmit={onSubmit} modalClose={modalClose} initialValues={data.getUserDetail}/>
                    </Modal>}
                />
            </Switch>
        </Drawer>
    )
}

export default RightDrawer