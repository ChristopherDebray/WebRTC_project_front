import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
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
app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
