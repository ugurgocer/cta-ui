import React, { useContext, useState } from 'react'
import { Controlled as CodeMirror} from 'react-codemirror2'
//import { JSHINT } from 'jshint'

import 'codemirror/addon/lint/javascript-lint'
//import 'codemirror/addon/lint/html-lint'
import 'codemirror/addon/lint/lint'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'

import 'codemirror/theme/solarized.css'
import 'codemirror/theme/material.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/theme/material-ocean.css'
import 'codemirror/theme/material-palenight.css'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/oceanic-next.css'

import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'

import { Select } from 'antd'

//window.JSHINT = JSHINT
const themes =  [
    "default",
    "solarized",
    "material",
    "material-darker",
    "material-palenight",
    "darcula",
    "oceanic-next"
]

const CodeArea = props => {
    const [value, setValue] = useState(0)
    const [theme, setTheme] = useState("solarized")

    return (
        <div>
            <Select
                defaultValue={theme}
                onSelect={value => {
                    setTheme(value)
                }}
                showSearch
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {themes.map(x => <Select.Option value={x} key={x}>{x}</Select.Option>)}
            </Select>
            <CodeMirror
                value={value}
                options={{
                    mode: "xml",
                    theme: theme,
                    lineNumbers: true,
                    gutters: ['CodeMirror-lint-markers'],
                    lint: true,
                    
                }}
                onBeforeChange={(editor, data, value) => {
                    setValue(value)
                }}
                onChange={(editor, data, value) => {
                    console.log(editor)
                }}
            />
        </div>
    )

}

export default CodeArea