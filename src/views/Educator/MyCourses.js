import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import Session from './../../global/Session'

import { message, Table } from 'antd'
import { compile } from 'path-to-regexp'
import moment from 'moment'

const COURSE_LIST = (
    gql`
        query($filter: CourseFilterBase){
            courseList(filter: $filter){
                courses{
                    title
                    description
                    seoLink
                    image{
                        url
                    }
                    educatorId
                    createdAt
                    updatedAt
                }
            }
        }
    `
)

const CreateCourse = props => {
    const { state: session } = useContext(Session)
    const { state } = useContext(Localize)

    const initialFilter = [
        { educatorId: { eq: session.educator.educatorId } }
    ]

    const [ filter, setFilter ] = useState(initialFilter)

    const { loading, data } = useQuery(COURSE_LIST, { variables: { filter: { and: filter } }, fetchPolicy: "network-only" })

    if(loading) return null

    const onRow = (record, rowIndex) => {
        return {
            onClick: () => {
                props.history.push(compile('/educator/panel/course/:seoLink')({ seoLink: record.seoLink }))
            }
        }
    }
    const columns = [
        {
            title: state.translation.image,
            key: 'image',
            dataIndex: 'image',
            render: (value, record) => value ? <img src={value.url} alt={record.title} className="picture-in-table"/> : ''
        },
        {
            title: state.translation.course_title,
            key: 'title',
            dataIndex: 'title'
        },
        {
            title: state.translation.seo_link,
            key: 'seoLink',
            dataIndex: 'seoLink'
        },
        {
            title: state.translation.description,
            key: 'description',
            dataIndex: 'description'
        },
        {
            title: state.translation.createdAt,
            key: 'createdAt',
            dataIndex: 'createdAt',
            render: value => moment(value).format('DD MMMM YYYY hh:mm')
        },
        {
            title: state.translation.updatedAt,
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            render: value => moment(value).format('DD MMMM YYYY hh:mm')
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={data.courseList.courses}
            onRow={onRow}
            loading={loading}
            rowKey={record => record.seoLink}
        />
    )

}

export default CreateCourse