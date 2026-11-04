import { describe, it, expect } from '@jest/globals';
import { testPatientModel as model } from './objects.utils';
import { getColumnMetadata } from './functions.utils';
import { FilterTask } from '../src/classes/FilterTask';
import type { FilterType } from '../src/classes/FilterTask';
import type { TableData, TableColumn, TableRow } from '../src/data/types';

describe('FilterTask filtering logic: "text" columns', () => {
  it.each`
    filterType | filterValue            | filteredRowsCount
    ${'eq'}    | ${'Vanessa Mackenzie'} | ${1}
    ${'sw'}    | ${'Van'}               | ${1}
    ${'ew'}    | ${'yer'}               | ${1}
    ${'has'}   | ${'ack'}               | ${1}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
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
    filterTask.setValue('Vanessa Mackenzie');

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
    filterTask.setRangeValues(['Vanessa Mackenzie', 'Tamara Palmer']);

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
    filterTask.setMultipleValues(['Vanessa Mackenzie', 'Tamara Palmer']);

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
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
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

  it('correctly filters rows with filter type range', () => {
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
  it.each`
    filterType | filterValue                             | filteredRowsCount
    ${'eq'}    | ${new Date('1992-03-01T01:45:38.117Z')} | ${1}
    ${'gt'}    | ${new Date('1992-03-01T01:45:38.117Z')} | ${1}
    ${'gte'}   | ${new Date('1992-03-01T01:45:38.117Z')} | ${2}
    ${'lt'}    | ${new Date('1954-05-12T11:25:52.131Z')} | ${0}
    ${'lte'}   | ${new Date('1954-05-12T11:25:52.131Z')} | ${1}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
    const columnKey = 'date_of_birth';
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

  it('correctly filters rows with filter type range', () => {
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
  it.each`
    filterType | filterValue   | filteredRowsCount
    ${'sw'}    | ${'City'}     | ${6}
    ${'ew'}    | ${'62'}       | ${3}
    ${'has'}   | ${'Hospital'} | ${6}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
    const columnKey = 'center';

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

  it('correctly filters rows with filter type any', () => {
    const columnKey = 'center';

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);

    if (!column) {
      throw new Error('no such column!');
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType('any');
    filterTask.setMultipleValues(['State Multi-Specialty Surgical Center', 'City Hospital 62']);

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(4);
  });
});
