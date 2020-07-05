import React, { useReducer } from 'react'

const SessionContext = React.createContext()

const initialState = {
    token: null,
    date: null,
    expiryDate: null,
    loginType: null,
}

const reducer = (state, action) => {
    const { type } = action

    switch(type){
        case 'login':
            localStorage.setItem('session', action.session.token)
            
            return {
                ...state,
                ...action.session
            }
        case 'logout':
            localStorage.setItem('session', initialState)

            return initialState
        default:
            return state
    }
}

export const SessionProvider = props => {
    const [ state, dispatch ] = useReducer(reducer, initialState)

    return (
        <SessionContext.Provider value={{ state, dispatch }}>
            {props.children}
        </SessionContext.Provider>
    )
}

export const SessionConsumer = SessionContext.Consumer

export default SessionContext