import React, { useContext } from 'react'
import { useQuery } from "@apollo/react-hooks"
import gql from 'graphql-tag'
import { List, Card, message } from 'antd'
import { compile } from 'path-to-regexp'
import { FaInbox } from 'react-icons/fa'
import Localize from '../global/Localize'
import moment from 'moment'

const COURSE_LIST_QUERY = (
     gql`
          query($filter: CourseFilterBase){
          courseList(filter: $filter) {
               courses {
                    id
                    title
                    description
                    seoLink
                    educatorId
                    createdAt
                    updatedAt
                    image {
                         url
                    }
               }
          }
          }
     `
)

const filterLayout = value => ({
     or: [{
          title: { iLike: `%${value}%` }
     },
     {
          description: { iLike: `%${value}%` }
     }]
})

const SearchCourse = props => {
     const { state } = useContext(Localize)
     const { loading, data } = useQuery(COURSE_LIST_QUERY, { variables: { filter: filterLayout(props.match.params.value) }, fetchPolicy: "network-only" })
 
     if (loading) return null
     else if (!data.courseList) {
          message.error('course not found')
     } else {
          return (
               <List
                    grid={{
                         gutter: 16,
                         xs: 1,
                         sm: 1,
                         md: 2,
                         lg: 3,
                         xl: 5,
                    }}
                    id="lastCourses"
                    header={state.translation['Search result for x pattern'](props.match.params.value)}
                    bordered
                    locale={{ emptyText: (
                         <span>
                             <FaInbox
                                 size={50}
                                 style={{ verticalAlign: "middle", marginRight: 8 }}
                             /><br/>
                             {state.translation['No course matched']}
                         </span>
                     )}}
                    dataSource={data.courseList.courses}
                    renderItem={item => (
                         <List.Item>
                              <Card
                                   style={{ width: 200, cursor: "pointer", margin: "10px auto" }}
                                   bodyStyle={{ padding: 16 }}
                                   cover={
                                        <img
                                             alt={item.title}
                                             src={item.image.url}
                                        />
                                   }
                                   title={item.name}
                                   onClick={() => props.history.push(compile('/course/:seoLink')({ seoLink: item.seoLink }))}
                              >
                                   <Card.Meta
                                        description={item.description}
                                        title={item.title}
                                   />
                              </Card>
                              <span style={{ paddingLeft: 16, fontWeight: 600 }}>{`${state.translation.createdAt}: `}</span>{moment(item.createdAt).format('DD-MM-YYYY')}
                         </List.Item>
                    )}
               />
          )    
     }
}

export default SearchCourse