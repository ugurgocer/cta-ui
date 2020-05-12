import React from 'react'
import { LocalizeProvider } from './Localize'

const ContextProvider = props => (
    <LocalizeProvider>
        {props.children}
    </LocalizeProvider>
)

export default ContextProvider