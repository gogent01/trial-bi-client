import { createApp } from 'vue';
import i18n from './services/i18n';

import App from './App.vue';

import './assets/style.css';

const app = createApp(App);
app.use(i18n);

app.mount('#app');
