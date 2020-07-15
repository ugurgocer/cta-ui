import React, { useState, useRef} from 'react'
import JoditEditor from "jodit-react"
import Parser from 'html-react-parser' 

const Example = ({}) => {
	const editor = useRef(null)
	const [content, setContent] = useState('<p></p>')
	
	const config = {
        readonly: false,
        
    }
	
	return (
        <React.Fragment>
            <JoditEditor
                config={config}
                tabIndex={4}
                onChange={(newContext, b) => setContent(newContext)}

            />
        </React.Fragment>
    )
}

export default Example