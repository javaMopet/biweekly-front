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
    if (!!operation?.variables) {
      console.log(
        '%c[Error]: Operation -> name',
        'color: #03fc0f;',
        operation.operationName
      )
      console.log('%c[Error]: Operation -> variables', 'color: #03fc0f;')
      console.debug(
        'operation.variables',
        JSON.stringify(operation.variables, null, 2)
      )
      // operation.variables.forEach((variable) => {
      //   console.log(variable)
      // })
    }
    // console.log('%csrc/apollo/index.js:15 graphQLErrors', 'color: #007acc;', {
    //   graphQLErrors
    // })
    if (!!graphQLErrors) {
      graphQLErrors.forEach((element) => {
        console.log(element.message)
      })
    }
    if (!!networkError) {
      console.log(
        '%csrc/apollo/index.js:20 networkError',
        'color: #22FF55;',
        networkError
      )
    }
    if (graphQLErrors) {
      graphQLErrors.map(({ message, extensions, path }) => {
        console.log(`%c[GraphQL error path]: ${path}`, 'color: #e99ff5;')
        console.log(`%c[GraphQL error message]: ${message}`, 'color: #ffe77d;')
        console.log(
          `%c[GraphQL error location]: ${location}`,
          'color: #63fffc;'
        )
        if (!!extensions) {
          console.debug('extensions', JSON.stringify(extensions, null, 2))
        }
        if (message.includes('requires authentication')) {
          console.log('logging out desde el apollo index.js ...............')
          removeCredentials()
          userLogout()
        }
      })
    }
    if (networkError) {
      console.log(
        '%csrc/apollo/index.js:43 networkError',
        'color: pink;',
        networkError
      )
      console.log(`[Network error code]: ${networkError.statusCode}`)
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
