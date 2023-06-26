import { describe, it, expect } from '@jest/globals';
import { testPatientModel as model } from './objects.utils';
import { getColumnMetadata } from './functions.utils';
import { FilterTask } from '../src/classes/FilterTask';
import type { FilterType } from '../src/classes/FilterTask';
import type { TableData, TableColumn, TableRow } from '../src/data/types';

describe('FilterTask filtering logic: "text" columns', () => {
  it.each`
    filterType | filterValue            | filteredRowsCount
    ${'eq'}    | ${'Василиса Макарова'} | ${1}
    ${'sw'}    | ${'Василиса'}          | ${1}
    ${'ew'}    | ${'Савельев'}          | ${1}
    ${'has'}   | ${'Макарова'}          | ${1}
  `(`correctly filters rows with filter type $text`, ({ filterType, filterValue, filteredRowsCount }) => {
    const columnKey = 'fullname';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType(filterType as FilterType);
    filterTask.setValue(filterValue);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(filteredRowsCount);
  });
  it.each`
    filterType | filterName
    ${'gt'}    | ${'greater than'}
    ${'gte'}   | ${'greater than or equal'}
    ${'lt'}    | ${'less than'}
    ${'lte'}   | ${'less than or equal'}
  `('excludes all rows on $filterType ($filterName) check', ({ filterType }) => {
    const columnKey = 'fullname';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType(filterType as FilterType);
    filterTask.setValue('Василиса Макарова');

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(0);
  });

  it('excludes all rows on range check', () => {
    const columnKey = 'fullname';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('range');
    filterTask.setRangeValues(['Василиса Макарова', 'Тамара Павлова']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(0);
  });

  it('excludes all rows on any (any matching factor level) check', () => {
    const columnKey = 'fullname';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('any');
    filterTask.setMultipleValues(['Василиса Макарова', 'Тамара Павлова']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(0);
  });
});

describe('FilterTask filtering logic: "number" columns', () => {
  it.each`
    filterType | filterValue | filteredRowsCount
    ${'eq'}    | ${69}       | ${1}
    ${'gt'}    | ${50}       | ${1}
    ${'gte'}   | ${50}       | ${4}
    ${'lt'}    | ${35}       | ${2}
    ${'lte'}   | ${28}       | ${1}
  `(`correctly filters rows with filter type $`, ({ filterType, filterValue, filteredRowsCount }) => {
    const columnKey = 'age';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType(filterType as FilterType);
    filterTask.setValue(filterValue);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(filteredRowsCount);
  });

  it('correctly filters rows with filter type $range', () => {
    const columnKey = 'age';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('range');
    filterTask.setRangeValues([28, 36]);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));
    expect(filteredRows.length).toBe(3);
  });
});

describe('FilterTask filtering logic: "date" columns', () => {
  it('correctly filters rows with filter type $eq', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('eq');
    const firstDate = new Date('1992-03-01T01:45:38.117Z');
    filterTask.setValue(firstDate);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(1);
  });

  it('correctly filters rows with filter type $gt', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('gt');
    const firstDate = new Date('1992-03-01T01:45:38.117Z');
    filterTask.setValue(firstDate);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(1);
  });

  it('correctly filters rows with filter type $gte', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('gte');
    const firstDate = new Date('1992-03-01T01:45:38.117Z');
    filterTask.setValue(firstDate);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(2);
  });

  it('correctly filters rows with filter type $lt', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('lt');
    const firstDate = new Date('1973-03-28T00:00:32.955Z');
    filterTask.setValue(firstDate);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(1);
  });

  it('correctly filters rows with filter type $lte', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('lte');
    const firstDate = new Date('1973-03-28T00:00:32.955Z');
    filterTask.setValue(firstDate);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(2);
  });

  it('correctly filters rows with filter type $range', () => {
    const columnKey = 'date_of_birth';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error('no such column!');
    }

    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('range');
    const firstDate = new Date('1992-03-01T01:45:38.117Z');
    const secondDate = new Date('1995-04-03T10:31:38.927Z');
    filterTask.setRangeValues([firstDate, secondDate]);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(1);
  });
});

describe('FilterTask filtering logic: "factor" columns', () => {
  it('performs testing if filter $sw', () => {
    const columnKey = 'center';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);

    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('sw');
    filterTask.setValue(['МКНЦ им. А.С. Логинова', 'ГКОБ 62']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows).toBe('МКНЦ им. А.С. Логинова');
  });

  it('performs testing if filter $ew', () => {
    const columnKey = 'center';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);

    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('ew');
    filterTask.setValue(['МКНЦ им. А.С. Логинова', 'ГКОБ 62']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(1);
  });

  it('performs testing if filter $has', () => {
    const columnKey = 'center';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);

    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('has');
    filterTask.setValue(['ГКОБ 62']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(3);
  });

  it('performs testing if filter $any', () => {
    const columnKey = 'center';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);

    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('any');
    filterTask.setMultipleValues(['МКНЦ им. А.С. Логинова', 'ГКОБ 62']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(4);
  });
});
