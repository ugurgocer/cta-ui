import React from 'react'
import { LocalizeProvider } from './Localize'
import { SessionProvider } from './Session'
import { BreadcrumbProvider } from './Breadcrumb'

const ContextProvider = props => (
    <LocalizeProvider>
        <SessionProvider>
            <BreadcrumbProvider>
                {props.children}
            </BreadcrumbProvider>
        </SessionProvider>
    </LocalizeProvider>
)

export default ContextProvider