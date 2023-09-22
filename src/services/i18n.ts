import { createI18n } from 'vue-i18n';
import ruMessages from '../locales/ru';
import { CURRENT_LOCALE } from '../config/variables';

type MessageSchema = typeof ruMessages;
const i18n = createI18n<[MessageSchema], 'ru-RU'>({
  legacy: false,
  locale: CURRENT_LOCALE,
  messages: {
    'ru-RU': ruMessages,
  },
});

export default i18n;
