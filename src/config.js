const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'

const config = {
    development : {
        api_uri: "http://localhost:5000/graphql"
    },

    production: {
        api_uri: "http://localhost:3000/graphql"
    }
}

export default config[mode]