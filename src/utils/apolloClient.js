import ApolloClient from 'apollo-boost'
import config from './../config'
import { InMemoryCache } from 'apollo-cache-inmemory'
import {cloneDeep} from 'lodash'

const client = new ApolloClient({
	uri: config.api_uri,
	cache: new InMemoryCache({
		addTypename: false
	}),
	request(operation, x, y){
		let headers = cloneDeep(operation.getContext().headers ? operation.getContext().headers : {})
		if(!operation.getContext().noToken){
			if(localStorage.getItem('session'))
				operation.setContext({
					headers: {
						...headers,
						'X-Token': localStorage.getItem('session'),
						'Accept-Language': localStorage.getItem('lang')
					}
				})
		}
		else{
			if(!localStorage.getItem('session'))
				operation.setContext({
					headers: {
						...headers,
						'Accept-Language': localStorage.getItem('lang')
					}
				})
		}

	}
})

export default client
