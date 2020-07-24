import React, { useContext, useState } from 'react'
import { Card, Row, Col, List, Divider, Button, Input } from 'antd'
import Localize from './../global/Localize'
import CodeMirror from './CodeArea'
import ReactHtmlParser from 'react-html-parser'
import { BsFillBackspaceReverseFill } from 'react-icons/bs'
import { FaStop, FaCaretRight, FaAngleDoubleRight } from 'react-icons/fa'
import axios from 'axios'
import { Link } from 'react-router-dom'

const CodePageComponent = props => {
    const { state } = useContext(Localize)
    const [value, setValue] = useState(props.document.documentUser ? props.document.documentUser.code : "")
    const [result, setResult] = useState({ result: props.document.documentUser ? props.document.documentUser.output : "", success: true })
    const [ run,  changeRun ] = useState(false)

    const runCode = value => {
        changeRun(true)
        if(props.document.language !== 'XML')
            axios.post('http://localhost:5000/run/code', {
                language: props.document.language,
                value,
                title: props.document.id
            }, { headers: { 'X-Token': localStorage.session } }).then(x => {
                setResult(x.data)
            })
        else{
            console.log(value)
            setResult({ success: true, result: ' ' })
        }
    }

    const stopCode = () => {
        changeRun(false)
    }

    return (
        <Card id="codeArea"
            title={<Link to="/"><div className="logo" /></Link>}
            extra={
                <span>
                    <Button
                        style={run ? { backgroundColor: "#ff4d4f", borderColor: "#ff4d4f", color: "#fff" } : {backgroundColor: "#4b8fe0", borderColor: "#4b8fe0", color: "#fff"}}
                        onClick={() => run ? stopCode() : runCode(value)}
                        disabled={!run ? value === "" : false}
                        icon={
                            run ? <FaStop 
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            /> : <FaCaretRight 
                            size={18}
                            style={{ verticalAlign: "middle", marginRight: 8 }}
                        />
                        }
                    >
                        {run ? state.translation.stop :  state.translation.run}
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        disabled={result.result !== "" && value !== "" ? !result.success : true}
                        onClick={() => props.stepOver(result.result, value)}
                        icon={
                            <FaAngleDoubleRight 
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                        }
                    >
                        {!props.isLastElement ? state.translation.next : state.translation['Finish Section']}
                    </Button>
                    <Divider type="vertical" />
                    <Button
                        onClick={props.goBack}
                        type="primary"
                        icon={
                            <BsFillBackspaceReverseFill 
                                size={18}
                                style={{ verticalAlign: "middle", marginRight: 8 }}
                            />
                        }
                    >
                        {state.translation['Return to Course']}
                    </Button>
                </span>
            }
        >
            <Row style={{ height: "100%" }}>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                    <Card
                        title={props.document.title}
                        className="full-content document-area"
                        style={{ height: "100%" }}
                    >
                        { ReactHtmlParser(props.document.document) }
                        <Divider />
                        <List
                            itemLayout="vertical"
                            dataSource={props.document.codes}
                            renderItem={item => (
                                <List.Item>
                                    <CodeMirror
                                        value={item.code}
                                        options={{
                                            mode: props.document.language.toLowerCase(),
                                            readOnly: true
                                        }}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                    <Card className="full-content code-area" style={{ height: "100%" }}>
                        <CodeMirror
                            value={value}
                            options={{
                                mode: props.document.language.toLowerCase()
                            }}
                            onChange={value => {
                                setValue(value)
                                if(run){
                                    stopCode()
                                    runCode(value)
                                }
                            }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={8}>
                    <Card
                        className="full-content result-area"
                        style={{ height: "100%" }}
                        bodyStyle={{ height: "100%"}}
                        title={state.translation['Output']}
                    >
                        {(props.document.language === 'XML' && (run || props.document.documentUser) )?
                            <div>
                                { ReactHtmlParser(value)}
                            </div>
                        :
                            <Input.TextArea 
                                disabled
                                value={result.result}
                                style={{
                                    resize: "none",
                                    fontFamily: "Source Code Pro",
                                    fontSize: 18,
                                    color: result.success ? '#555' : '#ff4d4f'
                                }}
                            />
                        }
                    </Card>
                </Col>
            </Row>
        </Card>
    )

}

export default CodePageComponent