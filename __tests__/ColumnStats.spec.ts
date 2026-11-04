import { describe, expect, it, vi } from 'vitest';
import { testPatientModel as model } from './objects.utils';
import { ColumnStats } from '../src/classes/ColumnStats';
import type { Model } from '../src/data/Model';
import type { TableColumn } from '../src/data/types';

// Expected labels and date formats below are English; pin the locale so results don't depend on the machine.
vi.mock('../src/config/variables', () => ({ CURRENT_LOCALE: 'en-US' }));

function getColumnMetadata(model: Model, columnKey: string): TableColumn | undefined {
  return model.schema.find((column) => column.key === columnKey);
}

function getColumnValues(model: Model, columnKey: string): unknown[] {
  return model.data.map((row) => row[columnKey]);
}

describe('Checks for a correct work of stats functions', () => {
  it('should build number stats if columnMetadata.type is "number"', () => {
    const stats = new ColumnStats();
    const columnKey = 'age';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);

    expect(stats.variable).toEqual('Age');
    expect(actualValue.data.length).toBe(10);
  });

  it('should build text stats if columnMetadata.type is "text"', () => {
    const stats = new ColumnStats();
    const columnKey = 'fullname';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);

    expect(stats.variable).toBe('Full name');
    expect(actualValue.data.length).toBe(2);
  });

  it('should build factor stats if columnMetadata.type is "factor"', () => {
    const stats = new ColumnStats();
    const columnKey = 'center';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);

    expect(stats.variable).toEqual('Study center');
    expect(actualValue.data.length).toBe(6);
  });

  it('should build date stats if columnMetadata.type is "date"', () => {
    const stats = new ColumnStats();
    const columnKey = 'date_of_birth';
    const columnMetadata = getColumnMetadata(model, columnKey) as TableColumn;
    const columnValues = getColumnValues(model, columnKey);
    const actualValue = stats.calculate(columnMetadata, columnValues);

    expect(stats.variable).toEqual('Date of birth');
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
      { param: 'Count', value: '10' },
      { param: 'Non-empty values', value: '8' },
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
      { param: 'Count', value: '10' },
      { param: 'Non-empty values', value: '8' },
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
      { param: 'Count', value: '10' },
      { param: 'Non-empty values', value: '7' },
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
      { param: 'Count', value: '10' },
      { param: 'Non-empty values', value: '8' },
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
      { param: 'Minimum', value: '28.0' },
      // Quartiles use linear interpolation (R's default, type 7), which simple-statistics adopted after 7.8.x
      { param: 'First quartile', value: '34.0' },
      { param: 'Median', value: '46.0' },
      { param: 'Third quartile', value: '50.0' },
      { param: 'Maximum', value: '69.0' },
      { param: 'Interquartile range', value: '16.0' },
      { param: 'Mean', value: '44.375' },
      { param: 'Standard deviation', value: '12.459' },
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
      { param: 'Count', value: '10' },
      { param: 'Non-empty values', value: '7' },
      { param: 'State Multi-Specialty Surgical Center', value: '1' },
      { param: 'City Hospital 1', value: '3' },
      { param: 'City Hospital 62', value: '3' },
      { param: 'No data', value: '3' },
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
    const max = result.data.find((item) => item.param === 'Maximum')?.value;
    const min = result.data.find((item) => item.param === 'Minimum')?.value;

    expect(max).toBe('4/3/1995');
    expect(min).toBe('5/12/1954');
  });
});
