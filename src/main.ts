import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi', // Use Material Design Icons
  },
})
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(vuetify)
app.use(router)

app.mount('#app')
