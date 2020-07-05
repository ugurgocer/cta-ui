import React from 'react'
import { LocalizeProvider } from './Localize'
import { SessionProvider } from './Session'

const ContextProvider = props => (
    <LocalizeProvider>
        <SessionProvider>
            {props.children}
        </SessionProvider>
    </LocalizeProvider>
)

export default ContextProvider