import React, { useContext, useState } from 'react'
import { useMutation, useQuery } from '@apollo/react-hooks'
import Session from '../global/Session'
import gql from 'graphql-tag'
import { Route, Switch } from 'react-router-dom'
import Localize from './../global/Localize'
import UserUpdate from './../components/UserDetail.form'

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
                userId
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
    `
)

const READ_QUERY = (
    gql`
    query($userId:Int!){
        getUserDetail(userId:$userId) {
            userId
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
            image: profilePicture {
                url
                uid
                response
                status
            }
        }
    }
    `
)

const RightDrawer = props => {
    const { state: session, dispatch: sessionDispatch } = useContext(Session)
    const { state } = useContext(Localize)
    const [ open, changeOpen ] = useState(false)
 
    const [ updateMutation, { loadingMutation } ] = useMutation(UPDATE_QUERY)
    const { loading: loadingQuery, data, refetch } = useQuery(READ_QUERY, { variables: { userId: session.userId }, fetchPolicy: "network-only" })

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
            email: values.email
        }

        let profilePicture = null
        if(values.image){
            profilePicture = {
                url: values.image.url,
                uid: values.image.uid,
                response: values.image.response,
                status: values.image.status,
            }

            delete values.image.xhr
        }

        let userDetail = {
            profilePicture,
            resume: values.resume,
            website: values.website,
            twitter: values.twitter,
            facebook: values.facebook,
            linkedin: values.linkedin,
            youtube: values.youtube
        }

        try{
            await updateMutation({ variables: { userDetail , user,  userId: session.userId }})

            message.success({ content: state.translation.messages['Transaction successful'] })
            modalClose()
            refetch()
        }catch(err){
            message.error({ content: err.message })
        }
    }

    if(loadingQuery) return null
    else
        return (
            <div id="user-dropdown">
                <Card
                    style={{ width: "100%" }}
                    bordered={false}
                >
                    <Card.Meta
                        avatar={<Avatar src={data.getUserDetail.image ? data.getUserDetail.image.url : ''} size="large" />}
                        title={session.user.fullName}
                        description={session.user.username}
                        style={{ marginBottom: 10 }}
                    />
                    <span
                        id="1"
                        onClick={()=>{
                            props.onRightPanelOpen(false)
                            changeOpen(true)
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
                <Modal
                    title={state.translation['Edit My Informations']}
                    visible={open}
                    centered
                    className="modal-action"
                    width="80%"
                    footer={null}
                    onCancel={() => changeOpen(false)}
                >
                    <UserUpdate onSubmit={onSubmit} modalClose={modalClose} initialValues={data.getUserDetail}/>
                </Modal>
            </div>
        )
}

export default RightDrawer