import { createHttpLink, HttpLink, InMemoryCache } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'
import { useSessionStore } from 'src/stores/sessionStore.js'
import { SessionStorage } from 'quasar'

export /* async */ function getClientOptions(/* {app, router, ...} */ options) {
  const { logoutUser } = useSessionStore()

  const errorLink = onError(({ networkError }) => {
    if (networkError) {
      console.error('Error el intentar Graphql:', networkError)
      if (networkError.statusCode === 401) logoutUser()
    }
  })

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const user = SessionStorage.getItem('user')
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: user.token ? `Bearer ${user.token}` : ''
      }
    }
  })

  const httpLink = new HttpLink({
    // You should use an absolute URL here
    uri: process.env.GRAPHQL_URL
  })

  return Object.assign(
    // General options.
    {
      link: errorLink.concat(authLink).concat(httpLink),
      cache: new InMemoryCache(),
      defaultOptions: {
        fetchPolicy: 'no-cache',
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'ignore'
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        },
        mutate: {
          errorPolicy: 'all'
        }
      }
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
