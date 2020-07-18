import React, { useContext } from 'react'
import Localize from './../global/Localize'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { compile } from 'path-to-regexp'

import { Card, List, Divider } from 'antd'


const EDUCATOR_LIST = (
    gql`
        {
            educatorList{
                educators {
                    id
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
        }
    `
)

const CourseSections = props => {
    const { data, loading } = useQuery(EDUCATOR_LIST, { fetchPolicy: "network-only" })

    if (loading) return null
    else{
        return (
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                }}
                dataSource={data.educatorList.educators}
                id="educators"
                renderItem={item => (
                    <List.Item style={{ width: "100%" }}>
                    <Card
                        style={{ width: 200, cursor: "pointer" }}
                        bodyStyle={{ padding: 16 }}
                        cover={
                            <img
                                alt={item.username}
                                src={item.profilePicture.url}
                            />
                        }
                        title={item.name}
                        onClick={() => props.history.push(compile('/educator/:username')({ username: item.username }))}
                    >
                        <Card.Meta
                            description={item.description}
                            title={item.username}
                        />
                    </Card>
                    </List.Item>
                )}
            />
        )
    }

}

export default CourseSections

