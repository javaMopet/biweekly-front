import { boot } from 'quasar/wrappers'
import { ApolloClient /*, createHttpLink */ } from '@apollo/client/core'
import { ApolloClients } from '@vue/apollo-composable'

import { getClientOptions } from 'src/apollo'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app /*, router, ...*/ }) => {
  const options = /* await */ getClientOptions(/* {app, router ...} */)
  const apolloClient = new ApolloClient(options)

  const apolloClients = {
    default: apolloClient
  }
  app.provide(ApolloClients, apolloClients)
})
