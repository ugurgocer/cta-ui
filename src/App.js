import React from 'react'
import './App.css'
import { ConfigProvider } from 'antd'
import Login from './views/Login'
import Register from './views/Register'
import ContextProvider from './global/index'
import { BrowserRouter, Switch, Route } from "react-router-dom"
import { ApolloProvider } from '@apollo/react-hooks'
import client from './utils/apolloClient'
import 'antd/dist/antd.css'

const App = () => {
	return (
		<div className="App">
			<ApolloProvider client={client}>
				<ContextProvider>
					<ConfigProvider locale="tr">
						<BrowserRouter>
							
							<div>
								<Switch>
									<Route path="/login" component={Login} />
									<Route path="/register" component={Register} />
								</Switch>
							</div>
						</BrowserRouter>
					</ConfigProvider>
				</ContextProvider>
			</ApolloProvider>
    	</div>
  	)
}

export default App
