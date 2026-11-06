import { afterEach, describe, expect, it, vi } from 'vitest';
import { testPatientModel as model } from './objects.utils';
import type { ColumnType, GroupingReactiveTableColumn, TableColumn, TableRow } from '../src/data/types';

async function withLocale(locale: string) {
  vi.resetModules();
  vi.doMock('../src/config/variables', () => ({ CURRENT_LOCALE: locale }));
  return {
    numbers: await import('../src/services/numbers'),
    ColumnStats: (await import('../src/classes/ColumnStats')).ColumnStats,
    compressRowGroup: (await import('../src/classes/Grouping')).compressRowGroup,
  };
}

afterEach(() => {
  vi.doUnmock('../src/config/variables');
});

describe.each`
  locale     | separator | plain       | stat        | integerStat | negative
  ${'en-US'} | ${'.'}    | ${'1234.5'} | ${'44.375'} | ${'28.0'}   | ${'-0.25'}
  ${'de-DE'} | ${','}    | ${'1234,5'} | ${'44,375'} | ${'28,0'}   | ${'-0,25'}
  ${'ru-RU'} | ${','}    | ${'1234,5'} | ${'44,375'} | ${'28,0'}   | ${'-0,25'}
`('Number formatting in $locale', ({ locale, separator, plain, stat, integerStat, negative }) => {
  it('detects the decimal separator', async () => {
    const { numbers } = await withLocale(locale as string);
    expect(numbers.decimalSeparator).toBe(separator);
  });

  it('formats numbers without thousands separators and keeps all digits', async () => {
    const { numbers } = await withLocale(locale as string);
    expect(numbers.formatNumber(1234.5)).toBe(plain);
    expect(numbers.formatNumber(-0.25)).toBe(negative);
    expect(numbers.formatNumber(1234567)).toBe('1234567');
    expect(numbers.formatNumber(0.123456789)).toBe(`0${separator}123456789`);
    expect(numbers.formatNumber(-0)).toBe('0');
  });

  it('formats statistics with 1 to 3 decimals', async () => {
    const { numbers } = await withLocale(locale as string);
    expect(numbers.formatStat(44.375)).toBe(stat);
    expect(numbers.formatStat(28)).toBe(integerStat);
    expect(numbers.formatStat(12.45912)).toBe(`12${separator}459`);
  });

  it('shows the locale separator in number inputs', async () => {
    const { numbers } = await withLocale(locale as string);
    expect(numbers.sanitizeNumberInput('1,5')).toBe(`1${separator}5`);
    expect(numbers.sanitizeNumberInput('1.5')).toBe(`1${separator}5`);
    expect(numbers.sanitizeNumberInput('-1.2,3a')).toBe(`-1${separator}23`);
    expect(numbers.sanitizeNumberInput('.5')).toBe('5');
    expect(numbers.sanitizeNumberInput('5-')).toBe('5');
  });

  it('parses numbers typed with either separator', async () => {
    const { numbers } = await withLocale(locale as string);
    expect(numbers.parseNumber('1,5')).toBe(1.5);
    expect(numbers.parseNumber('1.5')).toBe(1.5);
    expect(numbers.parseNumber('−2,5')).toBe(-2.5);
    expect(numbers.parseNumber(numbers.formatNumber(-0.25))).toBe(-0.25);
    expect(numbers.parseNumber('')).toBeUndefined();
    expect(numbers.parseNumber('-')).toBeUndefined();
  });
});

describe('Localized statistics and grouping in ru-RU', () => {
  it('shows statistics with a decimal comma and exports raw numbers', async () => {
    const { ColumnStats } = await withLocale('ru-RU');
    const columnMetadata = model.schema.find((column) => column.key === 'age') as TableColumn;
    const columnValues = model.data.map((row) => row.age);
    const data = new ColumnStats().calculate(columnMetadata, columnValues).data;

    expect(data.map((row) => row.value)).toEqual([
      '10',
      '8',
      '28,0',
      '34,0',
      '46,0',
      '50,0',
      '69,0',
      '16,0',
      '44,375',
      '12,459',
    ]);
    expect(data.map((row) => row.exportValue)).toEqual([10, 8, 28, 34, 46, 50, 69, 16, 44.375, 12.459]);
  });

  it('lists grouped numbers with a decimal comma', async () => {
    const { compressRowGroup } = await withLocale('ru-RU');
    const column: GroupingReactiveTableColumn = {
      origin: { key: 'patients', name: 'Patients', priority: 0 },
      position: 0,
      key: 'weight',
      name: 'weight',
      type: 'number' as ColumnType,
      hasFilter: false,
      hasSort: 'NONE',
      hasStats: false,
      grouping: { action: 'all' },
    };
    const rows: TableRow[] = [{ weight: 2.25 }, { weight: 1.5 }, { weight: undefined }];

    expect(compressRowGroup(rows, [column]).weight).toBe('1,5; 2,25; NA');
  });
});
