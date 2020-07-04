import React, { useContext, useState } from 'react'
import { AutoComplete, Input } from 'antd'
import Localize from './../global/Localize'

import '../asset/layout.css'


const SearchBox = props => {
    const { state } = useContext(Localize)
    const [ value, setValue ] = useState("")
    const options = []

    console.log(value)
    return (
        <span>
            <AutoComplete
                value={value}
                style={props.style}
                defaultActiveFirstOption={false}
                onSearch={value => setValue(value)}
                notFoundContent={null}
                options={options}
            >
                <Input.Search placeholder={state.translation['Find a new course']} enterButton onSearch={() => {console.log(value)}} />
            </AutoComplete>
        </span>

    )
}

export default SearchBox