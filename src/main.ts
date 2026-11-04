import { createApp } from 'vue';
import i18n from './services/i18n';
import { CURRENT_LOCALE } from './config/variables';

import App from './App.vue';

import './assets/style.css';

// Match the page language to the UI language (index.html defaults to English)
document.documentElement.lang = CURRENT_LOCALE;

const app = createApp(App);
app.use(i18n);

app.mount('#app');
