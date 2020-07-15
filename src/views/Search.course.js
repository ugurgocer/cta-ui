import React from 'react'
import { useQuery } from "@apollo/react-hooks"
import gql from 'graphql-tag'
import { List, Avatar, message } from 'antd'
import moment from 'moment'
// import logo from './../asset/logoo'

const COURSE_LIST_QUERY = (
     gql`
          query($filter: CourseFilterBase){
          courseList(filter: $filter) {
               courses {
                    courseId
                    title
                    description
                    seoLink
                    educatorId
                    createdAt
                    updatedAt
               }
          }
          }
     `
)

const filterLayout = value => ({
     and: [{
          title: { substring: value },
          or: [{
               description: { substring: value } 
          }]
     }]
})

const SearchCourse = props => {
     const { loading, data } = useQuery(COURSE_LIST_QUERY, { variables: { filter: filterLayout(props.match.params.value) }, fetchPolicy: "network-only" })
 
     if (loading) return null
     else if (!data.courseList) {
          message.error('course not found')
     } else {
          return (
               <List
                    itemLayout="horizontal"
                    dataSource={data && data.courseList.courses}
                    renderItem={item => (
                         <List.Item>
                              <List.Item.Meta
                                   avatar={<Avatar style={{backgroundColor:'#4db6ac'}} src="data:image/png;base64,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" />}
                                   title={<a href="https://ant.design">{item.title}</a>}
                                   description={item.description}
                              />
                              <span>{moment(item.createdAt).format('DD-MM-YYYY')}</span>
                         </List.Item>

                    )}
               />
          )
     }
}

export default SearchCourse