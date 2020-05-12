import React from 'react'
import './App.css'
import { ConfigProvider } from 'antd'
import LoginForm from './components/Login.form'
import ContextProvider from './global/index'

import 'antd/dist/antd.css'

const App = () => {
	return (
    	<div className="App">
			<ContextProvider>
				<ConfigProvider locale="tr">
					<LoginForm />
				</ConfigProvider>
			</ContextProvider>
    	</div>
  	)
}

export default App
