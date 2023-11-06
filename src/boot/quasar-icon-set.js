import { boot } from 'quasar/wrappers'

import { Quasar } from 'quasar'

const iconSetList = import.meta.glob('../../node_modules/quasar/icon-set/*.mjs')

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  const iconSetName = 'material-icons' // ... some logic to determine it (use Cookies Plugin?)
  try {
    iconSetList[`../../node_modules/quasar/icon-set/${iconSetName}.mjs`]().then(
      (lang) => {
        Quasar.iconSet.set(setDefinition.default)
      }
    )
  } catch (err) {
    // Requested Quasar Icon Set does not exist,
    // let's not break the app, so catching error
  }
})
