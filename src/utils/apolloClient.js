import ApolloClient from 'apollo-boost'
import config from './../config'
import {cloneDeep} from 'lodash'

const client = new ApolloClient({
	uri: config.api_uri,
	request(operation, x, y){
		let headers = cloneDeep(operation.getContext().headers ? operation.getContext().headers : {})
		if(!operation.getContext().noToken){
			if(localStorage.getItem('token'))
				operation.setContext({
					headers: {
						...headers,
						'X-Token': localStorage.getItem('token'),
						'Accept-Language': localStorage.getItem('lang')
					}
				})
		}
		else{
			if(!localStorage.getItem('token'))
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
