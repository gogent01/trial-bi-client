import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import ruMessages from './locales/ru';

import App from './App.vue';

import './assets/style.css';

type MessageSchema = typeof ruMessages;
const i18n = createI18n<[MessageSchema], 'ru-RU'>({
  legacy: false,
  locale: 'ru-RU',
  messages: {
    'ru-RU': ruMessages,
  },
});

const app = createApp(App);
app.use(i18n);

app.mount('#app');
