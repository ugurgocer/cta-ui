import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Localize from './../../global/Localize'
import Session from './../../global/Session'

import { Table } from 'antd'
import { compile } from 'path-to-regexp'
import moment from 'moment'
import { AiOutlineCheckCircle } from 'react-icons/ai'

const COURSE_LIST = (
    gql`
        query($filter: CourseFilterBase, $paging: Paging){
            courseList(filter: $filter, paging: $paging){
                courses{
                    title
                    description
                    seoLink
                    image{
                        url
                    }
                    educatorId
                    createdAt
                    isPublished
                    updatedAt
                }
                totalCount
            }
        }
    `
)

const MyCourses = props => {
    const { state: session } = useContext(Session)
    const { state } = useContext(Localize)
    const [ paging, changePaging ] = useState({ offset: 0, limit: 5 })

    const initialFilter = [
        { educatorId: { eq: session.educator.id } }
    ]

    const [ filter ] = useState(initialFilter)

    const { loading, data, refetch } = useQuery(COURSE_LIST, { variables: { filter: { and: filter }, paging }, fetchPolicy: "network-only" })

    if(loading) return null

    const changePage = pagination => {
        changePaging({ offset: (pagination.current - 1) * pagination.pageSize, limit: pagination.pageSize  })

        refetch()
    }

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
        },
        {
            title: state.translation.published,
            key: 'isPublished',
            dataIndex: 'isPublished',
            align: 'center',
            render: value => value ? <AiOutlineCheckCircle size={18} style={{ verticalAlign: "middle" }}/> : ''
        }
    ]

    return (
        <Table
            columns={columns}
            dataSource={data.courseList.courses}
            onRow={onRow}
            loading={loading}
            pagination={{ total: data.courseList.totalCount, showTotal: (total, range) => `${state.translation['Total Course Count']}: ${total}`, pageSize: 5, current: (paging.offset / paging.limit) + 1 }}
            rowKey={record => record.seoLink}
            onChange={(pagination) => changePage(pagination)}
        />
    )

}

export default MyCourses