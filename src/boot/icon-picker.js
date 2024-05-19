// src/boot/icon-picker.js
import { boot } from 'quasar/wrappers'
import QIconPicker from '@quasar/quasar-ui-qiconpicker'
import '@quasar/quasar-ui-qiconpicker/dist/index.css'
import materialIcons from '@quasar/quasar-ui-qiconpicker/dist/icon-set/material-icons.umd.js'
import fontawesomeV5 from '@quasar/quasar-ui-qiconpicker/dist/icon-set/fontawesome-v5.umd.js'

export default boot(({ app }) => {
  app.use(QIconPicker, {
    iconSets: {
      'material-icons': materialIcons,
      'fontawesome-v5': fontawesomeV5
    }
  })
  // QIconPicker.addIconSet(materialIcons)
  // QIconPicker.addIconSet(fontawesomeV5)
  // app.use(QIconPicker)
})
