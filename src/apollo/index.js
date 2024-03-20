import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { SessionStorage } from 'quasar'
import { useSessionService } from 'src/composables/login/useSessionService'

export /* async */ function getClientOptions(/* {app, router, ...} */ options) {
  const { userLogout, removeCredentials } = useSessionService()

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
        if (message.includes('requires authentication')) {
          console.log('logging out desde el apollo index.js ...............')
          removeCredentials()
          userLogout()
        }
      })
    }
    if (networkError) {
      // console.error('Error el intentar Graphql:', networkError)
      console.log(`[Network error]: ${networkError}`)
      if (networkError.statusCode === 401) userLogout()
    }
  })

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    let credentials = ''
    if (!!SessionStorage.getItem('credentials')) {
      credentials = JSON.parse(SessionStorage.getItem('credentials'))
    }

    return {
      headers: {
        ...headers,
        uid: credentials.uid,
        client: credentials.client,
        access_token: credentials.accessToken
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
