import React, { useReducer } from 'react'

const BreadcrumbContext = React.createContext()

const initialState = {
    breadcrumb: []
}

const reducer = (state, action) => {
    const { type } = action

    switch(type){
        case 'addBreadcrumb':
            return {
                breadcrumb: action.breadcrumb
            }
        case 'clearBreadcrumb':
            return {
                breadcrumb: []
            }
        default:
            return state
    }
}

export const BreadcrumbProvider = props => {
    const [ state, dispatch ] = useReducer(reducer, initialState)

    return (
        <BreadcrumbContext.Provider value={{ state, dispatch }}>
            {props.children}
        </BreadcrumbContext.Provider>
    )
}

export const BreadcrumbConsumer = BreadcrumbContext.Consumer

export default BreadcrumbContext