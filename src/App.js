import React from 'react'

import { ConfigProvider } from 'antd'
import ContextProvider from './global/index'
import { ApolloProvider } from '@apollo/react-hooks'
import client from './utils/apolloClient'

import { BrowserRouter, Switch, Route } from "react-router-dom"
import Login from './views/Login'
import Register from './views/Register'
import Layout from './views/Layout'
import { createBrowserHistory } from 'history'

import './App.css'
import 'antd/dist/antd.css'

const App = () => {
	return (
		<div className="App">
			<ApolloProvider client={client}>
				<ContextProvider>
					<ConfigProvider locale="tr">
						<BrowserRouter history={createBrowserHistory()}>
							<div>
								<Switch>
									<Route path="/login" component={Login} />
									<Route path="/register" component={Register} />
									<Route exact path="/*" component={Layout} />
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
