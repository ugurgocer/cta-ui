import React, { useContext } from 'react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import { deleteUnchangedValue } from './../../utils/form'

import { Card, message } from 'antd'
import BeEducatorForm from '../../components/BeEducator.form'

const INFORMATION_UPDATE = (
    gql`
        mutation($educator: EducatorUpdateInput , $id: Int!){
            educatorUpdate(educator: $educator, id:$id) {
                educatorId
                name
                username
                description
            }
        }
    `
)

const UpdateInformation = props => {
    const [educatorUpdate, { loading }] = useMutation(INFORMATION_UPDATE)
    const { state } = useContext(Localize)
    
    
    const onSubmit = async values => {
        values = await deleteUnchangedValue(props.educator, values)

        try{
            await educatorUpdate({ variables: { educator: values, id: parseInt(props.educator.educatorId) }})
            message.success({ content: state.translation.messages['Transaction successful'] })  
        }catch(err){
            message.error({ content: err.message })
        }
    }
    
    return (
        <Card
            title={state.translation['Update My Informations']}
        >
            <BeEducatorForm onSubmit={onSubmit} loading={loading} initialValues={props.educator}/>
        </Card>
    )

}

export default UpdateInformation