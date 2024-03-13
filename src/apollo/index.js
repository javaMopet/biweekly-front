import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { useSessionStore } from 'src/stores/sessionStore.js'
import { SessionStorage } from 'quasar'

export /* async */ function getClientOptions(/* {app, router, ...} */ options) {
  const { logoutUser } = useSessionStore()

  const errorLink = onError(({ operation, graphQLErrors, networkError }) => {
    // console.log(
    //   `[operation]: ${operation.operationName}, Variables: ${operation.variables}`
    // )
    console.log('[Error]: Operation', operation.operationName)
    console.log('Variables', operation.variables.input)
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
        console.log('location', location)
      })
    }
    if (networkError) {
      // console.error('Error el intentar Graphql:', networkError)
      console.log(`[Network error]: ${networkError}`)
      if (networkError.statusCode === 401) logoutUser()
    }
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const user = SessionStorage.getItem('user')
    const auth_token = SessionStorage.getItem('auth_token')
    // return the headers to the context so httpLink can read them
    console.log('token', auth_token)
    return {
      headers: {
        ...headers,
        Authorization: auth_token.toString()
      }
    }
  })

  return Object.assign(
    // General options.
    {
      link: errorLink.concat(authLink).concat(
        createHttpLink({
          uri: process.env.GRAPHQL_URL
        })
      ),
      cache: new InMemoryCache()
    },
    // Specific Quasar mode options.
    process.env.MODE === 'spa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'ssr'
      ? {
          //
        }
      : {},
    process.env.MODE === 'pwa'
      ? {
          //
        }
      : {},
    process.env.MODE === 'bex'
      ? {
          //
        }
      : {},
    process.env.MODE === 'cordova'
      ? {
          //
        }
      : {},
    process.env.MODE === 'capacitor'
      ? {
          //
        }
      : {},
    process.env.MODE === 'electron'
      ? {
          //
        }
      : {},
    // dev/prod options.
    process.env.DEV
      ? {
          //
        }
      : {},
    process.env.PROD
      ? {
          //
        }
      : {},
    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER
      ? {
          ssrMode: true
        }
      : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? {
          ssrForceFetchDelay: 100
        }
      : {}
  )
}
