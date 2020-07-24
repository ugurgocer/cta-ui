import React from 'react'
import CodeMirror from 'react-codemirror'
import { JSHINT } from 'jshint'

import 'codemirror/addon/lint/javascript-lint'
import 'codemirror/addon/lint/lint'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/python/python'

import 'codemirror/theme/material.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/lint/lint.css'

const CodeArea = props => {
    if(props.options.mode === 'javascript')
        window.JSHINT = JSHINT

    return (
        <CodeMirror
            value={props.value}
            options={{
                lineNumbers: true,
                gutters: ['CodeMirror-lint-markers'],
                lint: true,
                theme: "material",
                mode: "javascript",
                ...props.options,
                autocorrect: true,
            }}
            name="code"
            onChange={(value) => props.onChange(value)}
        />
    )

}

export default CodeArea