import { describe, expect, it, vi } from 'vitest';
import i18n from '../src/services/i18n';

vi.mock('../src/config/variables', () => ({ CURRENT_LOCALE: 'ru-RU' }));

describe('Russian pluralization of the record count', () => {
  it.each`
    n       | ending
    ${0}    | ${'0 записей'}
    ${1}    | ${'1 запись'}
    ${2}    | ${'2 записи'}
    ${4}    | ${'4 записи'}
    ${5}    | ${'5 записей'}
    ${11}   | ${'11 записей'}
    ${14}   | ${'14 записей'}
    ${21}   | ${'21 запись'}
    ${22}   | ${'22 записи'}
    ${111}  | ${'111 записей'}
    ${112}  | ${'112 записей'}
    ${121}  | ${'121 запись'}
    ${2354} | ${'2354 записи'}
  `('uses the right form for $n', ({ n, ending }) => {
    const text = i18n.global.t('query_result.records_found', { n: n as number });
    expect(text.endsWith(ending as string)).toBe(true);
  });
});
