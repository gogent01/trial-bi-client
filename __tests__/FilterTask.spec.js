import { describe, it, expect } from '@jest/globals';
import { testPatientModel as model } from './objects.utils';
import { getColumnMetadata } from './functions.utils';
import { FilterTask } from '../src/classes/FilterTask';
describe('FilterTask filtering logic: "text" columns', () => {
    it.each `
    filterType | filterValue            | filteredRowsCount
    ${'eq'}    | ${'Василиса Макарова'} | ${1}
    ${'sw'}    | ${'Вас'}               | ${1}
    ${'ew'}    | ${'ьев'}               | ${1}
    ${'has'}   | ${'кар'}               | ${1}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
        const columnKey = 'fullname';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType(filterType);
        filterTask.setValue(filterValue);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(filteredRowsCount);
    });
    it.each `
    filterType | filterName
    ${'gt'}    | ${'greater than'}
    ${'gte'}   | ${'greater than or equal'}
    ${'lt'}    | ${'less than'}
    ${'lte'}   | ${'less than or equal'}
  `('excludes all rows on $filterType ($filterName) check', ({ filterType }) => {
        const columnKey = 'fullname';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType(filterType);
        filterTask.setValue('Василиса Макарова');
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(0);
    });
    it('excludes all rows on range check', () => {
        const columnKey = 'fullname';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType('range');
        filterTask.setRangeValues(['Василиса Макарова', 'Тамара Павлова']);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(0);
    });
    it('excludes all rows on any (any matching factor level) check', () => {
        const columnKey = 'fullname';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType('any');
        filterTask.setMultipleValues(['Василиса Макарова', 'Тамара Павлова']);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(0);
    });
});
describe('FilterTask filtering logic: "number" columns', () => {
    it.each `
    filterType | filterValue | filteredRowsCount
    ${'eq'}    | ${69}       | ${1}
    ${'gt'}    | ${50}       | ${1}
    ${'gte'}   | ${50}       | ${4}
    ${'lt'}    | ${35}       | ${2}
    ${'lte'}   | ${28}       | ${1}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
        const columnKey = 'age';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType(filterType);
        filterTask.setValue(filterValue);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(filteredRowsCount);
    });
    it('correctly filters rows with filter type range', () => {
        const columnKey = 'age';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType('range');
        filterTask.setRangeValues([28, 36]);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(3);
    });
});
describe('FilterTask filtering logic: "date" columns', () => {
    it.each `
    filterType | filterValue                             | filteredRowsCount
    ${'eq'}    | ${new Date('1992-03-01T01:45:38.117Z')} | ${1}
    ${'gt'}    | ${new Date('1992-03-01T01:45:38.117Z')} | ${1}
    ${'gte'}   | ${new Date('1992-03-01T01:45:38.117Z')} | ${2}
    ${'lt'}    | ${new Date('1954-05-12T11:25:52.131Z')} | ${0}
    ${'lte'}   | ${new Date('1954-05-12T11:25:52.131Z')} | ${1}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
        const columnKey = 'date_of_birth';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType(filterType);
        filterTask.setValue(filterValue);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(filteredRowsCount);
    });
    it('correctly filters rows with filter type range', () => {
        const columnKey = 'date_of_birth';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType('range');
        const firstDate = new Date('1992-03-01T01:45:38.117Z');
        const secondDate = new Date('1995-04-03T10:31:38.927Z');
        filterTask.setRangeValues([firstDate, secondDate]);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(1);
    });
});
describe('FilterTask filtering logic: "factor" columns', () => {
    it.each `
    filterType | filterValue | filteredRowsCount
    ${'sw'}    | ${'ГК'}     | ${6}
    ${'ew'}    | ${'62'}     | ${3}
    ${'has'}   | ${'ОБ'}     | ${6}
  `(`correctly filters rows with filter type $filterType`, ({ filterType, filterValue, filteredRowsCount }) => {
        const columnKey = 'center';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType(filterType);
        filterTask.setValue(filterValue);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(filteredRowsCount);
    });
    it('correctly filters rows with filter type any', () => {
        const columnKey = 'center';
        const rows = model.data;
        const column = getColumnMetadata(model, columnKey);
        if (!column) {
            throw new Error('no such column!');
        }
        const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
        filterTask.setType('any');
        filterTask.setMultipleValues(['МКНЦ им. А.С. Логинова', 'ГКОБ 62']);
        const filteredRows = rows.filter((row) => filterTask.apply(row));
        expect(filteredRows.length).toBe(4);
    });
});
