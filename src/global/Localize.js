import React, { useReducer } from 'react'
import lang from './../translation/index'

const LocalizeContext = React.createContext()

const initialState = {
    language: localStorage.language ? localStorage.language : 'TR' ,
    translation: localStorage.language ? lang[localStorage.language] : lang.TR
}

const reducer = (state, action) => {
    const { type } = action

    switch(type){
        case 'switchLanguage':
            localStorage.setItem('language', state.language === 'TR' ? 'EN' : 'TR')
            
            return {
                language: state.language === 'TR' ? 'EN' : 'TR',
                translation: state.language === 'TR' ? lang['EN'] : lang['TR']
            }
        default:
            return state
    }
}

export const LocalizeProvider = props => {
    const [ state, dispatch ] = useReducer(reducer, initialState)

    return (
        <LocalizeContext.Provider value={{ state, dispatch }}>
            {props.children}
        </LocalizeContext.Provider>
    )
}

export const LocalizeConsumer = LocalizeContext.Consumer

export default LocalizeContext