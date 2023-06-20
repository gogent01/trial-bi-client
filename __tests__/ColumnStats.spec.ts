import type { Database } from '../src/data/Database';
import { BreastDatabase } from '../src/data/breast/BreastDatabase';
import { ColumnStats, type StatsRow } from '../src/classes/ColumnStats';
import type { DataQuery, TableRow } from '../src/data/types';
import { Model } from '../src/data/Model';
import type { TableColumn } from '../src/data/types';
import  { describe, expect, it } from '@jest/globals';

const db: Database = new BreastDatabase(10);

const query: DataQuery = [
  {
    trialKey: '',
    modelKey: 'patients',
    columnKey: 'fullname',
  },
  {
    trialKey: '',
    modelKey: 'patients',
    columnKey: 'center',
  },
  {
    trialKey: '',
    modelKey: 'patients',
    columnKey: 'date_of_birth',
  },
  {
    trialKey: '',
    modelKey: 'patients',
    columnKey: 'age',
  },
];

const schema: TableColumn[] = [
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 0,
    key: 'id',
    name: 'id',
    type: 'id',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 1,
    key: 'center',
    name: 'Центр проведения исследования',
    type: 'factor',
    levels: ['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62'],
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 2,
    key: 'fullname',
    name: 'ФИО',
    type: 'text',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 3,
    key: 'date_of_birth',
    name: 'Дата рождения',
    type: 'date',
  },
  {
    origin: { key: 'patients', name: 'Пациенты', priority: 0 },
    position: 4,
    key: 'age',
    name: 'Возраст',
    type: 'number',
  },
];

const data: TableRow[] = [
  {
    id: 0,
    center: 'ГКОБ 62',
    fullname: 'Фока Юдин',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 1,
    center: undefined,
    fullname: 'Ульян Богданов',
    date_of_birth: new Date('1954-05-12T11:25:52.131Z'),
    age: 69,
  },
  {
    id: 2,
    center: 'ГКОБ 62',
    fullname: 'Зосима Мишин',
    date_of_birth: new Date('1992-03-01T01:45:38.117Z'),
    age: 31,
  },
  {
    id: 3,
    center: 'ГКОБ 1',
    fullname: 'Давыд Нестеров',
    date_of_birth: undefined,
    age: undefined,
  },
  {
    id: 4,
    center: 'МКНЦ им. А.С. Логинова',
    fullname: 'Анжела Фокина',
    date_of_birth: new Date('1973-05-09T12:07:54.510Z'),
    age: 50,
  },
  {
    id: 5,
    center: undefined,
    fullname: 'Василиса Макарова',
    date_of_birth: new Date('1973-03-28T00:00:32.955Z'),
    age: 50,
  },
  {
    id: 6,
    center: 'ГКОБ 62',
    fullname: 'Тамара Павлова',
    date_of_birth: new Date('1973-06-06T08:34:21.479Z'),
    age: 50,
  },
  {
    id: 7,
    center: 'ГКОБ 1',
    fullname: 'Милий Савельев',
    date_of_birth: new Date('1981-01-13T18:09:13.510Z'),
    age: 42,
  },
  {
    id: 8,
    center: 'ГКОБ 1',
    fullname: undefined,
    date_of_birth: new Date('1988-07-19T12:29:06.024Z'),
    age: 35,
  },
  {
    id: 9,
    center: undefined,
    fullname: undefined,
    date_of_birth: new Date('1995-04-03T10:31:38.927Z'),
    age: 28,
  },
];

const model = new Model('patients', 'Пациенты', 0, schema, data);

function getColumnMetadata(model: Model, columnKey: string): TableColumn | undefined {
  return model.schema.find((column) => column.key === columnKey);
}

function getColumnValues(model: Model, columnKey: string): unknown[] {
  return model.data.map((row) => row[columnKey]);
}

describe('Building of stats table for different types of data columns', () => {
  it('does something', async () => {
    const columnKey = 'date_of_birth';
    const columnMetadata = getColumnMetadata(model, columnKey);
    const columnValues = getColumnValues(model, columnKey);

    if (!columnMetadata) {
      throw new Error('no such column!');
    }

    const stats = new ColumnStats();
    const output = stats.calculate(columnMetadata, columnValues);

    console.log(columnMetadata);
    console.log(columnValues);
    console.log(output);

    expect(true).toBe(true);
  });
});

describe('Checks for a correct work of stats functions', () => {
  it('should build number stats if columnMetadata.type is "number"', () => {
    const stats = new ColumnStats();
    const columnKey = 'age';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(stats.variable).toEqual('Возраст');
    expect(actualValue.data.length).toBe(10);
  });

  it('should build text stats if columnMetadata.type is "text"', () => {
    const stats = new ColumnStats();
    const columnKey = 'fullname';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(stats.variable).toBe('ФИО');
    expect(actualValue.data.length).toBe(2);
  });

  it('should build factor stats if columnMetadata.type is "factor"', () => {
    const stats = new ColumnStats();
    const columnKey = 'center';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(stats.variable).toEqual('Центр проведения исследования');
    expect(actualValue.data.length).toBe(6);
  });

  it('should build date stats if columnMetadata.type is "date"', () => {
    const stats = new ColumnStats();
    const columnKey = 'date_of_birth';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(stats.variable).toEqual('Дата рождения');
    expect(actualValue.data.length).toBe(4);
  });
});

describe('Check if all values and NA are correctly counted', () => {
  it('should count all values and NaN if columnMetadata.type is "number"', () => {
    const stats = new ColumnStats();
    const columnKey = 'age';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const expectedValue = [
      { param: 'Число наблюдений', value: '10' },
      { param: 'Заполненных значений', value: '8' },
    ];
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(actualValue.data.slice(0, 2)).toStrictEqual(expectedValue);
  });

  it('should count all values and number of filled vallues if columnMetadata.type is "text"', () => {
    const stats = new ColumnStats();
    const columnKey = 'fullname';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const expectedValue = [
      { param: 'Число наблюдений', value: '10' },
      { param: 'Заполненных значений', value: '8' },
    ];
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(actualValue.data.slice(0, 2)).toStrictEqual(expectedValue);
  });

  it('should count all values and NaN if columnMetadata.type is "factor"', () => {
    const stats = new ColumnStats();
    const columnKey = 'center';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const expectedValue = [
      { param: 'Число наблюдений', value: '10' },
      { param: 'Заполненных значений', value: '7' },
    ];
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(actualValue.data.slice(0, 2)).toStrictEqual(expectedValue);
  });

  it('should count all values and NaN if columnMetadata.type is "date"', () => {
    const stats = new ColumnStats();
    const columnKey = 'date_of_birth';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const expectedValue = [
      { param: 'Число наблюдений', value: '10' },
      { param: 'Заполненных значений', value: '8' },
    ];
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(actualValue.data.slice(0, 2)).toStrictEqual(expectedValue);
  });
});

describe('check for correct perform of basic statistics', () => {
  it('should correctly count basic statistics in number columns', () => {
    const stats = new ColumnStats();
    const columnKey = 'age';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const expectedValue = [
      { param: 'Минимум', value: '28.0' },
      { param: 'Первый квартиль', value: '33.0' },
      { param: 'Медиана', value: '46.0' },
      { param: 'Третий квартиль', value: '50.0' },
      { param: 'Максимум', value: '69.0' },
      { param: 'Межкварт. интервал', value: '17.0' },
      { param: 'Среднее', value: '44.375' },
      { param: 'Станд. отклонение', value: '12.459' },
    ];
    const actualValue = stats.calculate(columnMetadata, columnValues);
    expect(actualValue.data.slice(2, 10)).toStrictEqual(expectedValue);
  });

  describe('correct count of factors in factor column', () => {
    it('should correctly perform count of factors', () => {
      const stats = new ColumnStats();
      const columnKey = 'center';
      const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
      const columnValues = getColumnValues(model, columnKey);
      const expectedValue = [
        { param: 'Число наблюдений', value: '10' },
        { param: 'Заполненных значений', value: '7' },
        { param: 'МКНЦ им. А.С. Логинова', value: '1' },
        { param: 'ГКОБ 1', value: '3' },
        { param: 'ГКОБ 62', value: '3' },
        { param: 'Нет данных', value: '0' },
      ];
      const actualValue = stats.calculate(columnMetadata, columnValues);
      expect(actualValue.data).toStrictEqual(expectedValue);
    });
  });

  describe('check min and max values in date columns', () => {
    it('should correctly find max and min date', () => {
      const stats = new ColumnStats();
      const columnKey = 'date_of_birth';
      const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
      const columnValues = getColumnValues(model, columnKey);
      const result = stats.calculate(columnMetadata, columnValues);
      const max = result.data.find((item) => item.param === 'Максимум')?.value;
      const min = result.data.find((item) => item.param === 'Минимум')?.value;
      if (!max || !min) {
        throw new Error('No values found!');
      };
      expect(max).toBe("03.04.1995");
      expect(min).toBe('12.05.1954');
    });
  });
});
