import { createI18n, type PluralizationRule } from 'vue-i18n';
import ruMessages from '../locales/ru-RU';
import enMessages from '../locales/en-US';
import { CURRENT_LOCALE } from '../config/variables';

type MessageSchema = typeof enMessages;
const i18n = createI18n<[MessageSchema], 'ru-RU' | 'en-US'>({
  legacy: false,
  locale: CURRENT_LOCALE,
  pluralizationRules: {
    'ru-RU': pluralizationRu as PluralizationRule,
  },
  messages: {
    'ru-RU': ruMessages,
    'en-US': enMessages,
  },
});

function pluralizationRu(count: number, choicesLength: number, orgRule: PluralizationRule) {
  if (count === 0) {
    return 0;
  }

  const teen = count > 10 && count < 20;
  const endsWithOne = count % 10 === 1;
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && count % 10 >= 2 && count % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

export default i18n;
