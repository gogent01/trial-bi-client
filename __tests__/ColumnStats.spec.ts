import { describe, expect, it } from '@jest/globals';
import { testPatientModel as model } from './objects.utils';
import { ColumnStats } from '../src/classes/ColumnStats';
import type { Model } from '../src/data/Model';
import type { TableColumn } from '../src/data/types';

function getColumnMetadata(model: Model, columnKey: string): TableColumn | undefined {
  return model.schema.find((column) => column.key === columnKey);
}

function getColumnValues(model: Model, columnKey: string): unknown[] {
  return model.data.map((row) => row[columnKey]);
}

// describe('Building of stats table for different types of data columns', () => {
//   it('does something', async () => {
//     const columnKey = 'date_of_birth';
//     const columnMetadata = getColumnMetadata(model, columnKey);
//     const columnValues = getColumnValues(model, columnKey);
//
//     if (!columnMetadata) {
//       throw new Error('no such column!');
//     }
//
//     const stats = new ColumnStats();
//     const output = stats.calculate(columnMetadata, columnValues);
//
//     console.log(columnMetadata);
//     console.log(columnValues);
//     console.log(output);
//
//     expect(true).toBe(true);
//   });
// });

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

describe('Checks if all values and NA are correctly counted', () => {
  it('should count all values and of filled values if columnMetadata.type is "number"', () => {
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

  it('should count all values and number of filled values if columnMetadata.type is "text"', () => {
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

  it('should count all values and of filled values if columnMetadata.type is "factor"', () => {
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

  it('should count all values and of filled values if columnMetadata.type is "date"', () => {
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

describe('Checks for correct calculations of basic statistics', () => {
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

  it('should correctly find max and min date', () => {
    const stats = new ColumnStats();
    const columnKey = 'date_of_birth';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const result = stats.calculate(columnMetadata, columnValues);
    const max = result.data.find((item) => item.param === 'Максимум')?.value;
    const min = result.data.find((item) => item.param === 'Минимум')?.value;

    expect(max).toBe('03.04.1995');
    expect(min).toBe('12.05.1954');
  });
});
