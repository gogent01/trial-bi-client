import { describe, it, expect } from "@jest/globals";
import { testPatientModel as model } from "./objects.utils";
import { getColumnMetadata } from "./functions.utils";
import { FilterTask } from "../src/classes/FilterTask";
import type { FilterType } from "../src/classes/FilterTask";
import type { TableData, TableColumn, TableRow } from "../src/data/types";

describe("FilterTask filtering logic: \"text\" columns", () => {
  it.each`
    filterType | filter                 | result
    ${"eq"}    | ${"Василиса Макарова"} | ${1}
    ${"sw"}    | ${"Василиса"}          | ${1}
    ${"ew"}    | ${"Савельев"}          | ${1}
    ${"has"}   | ${"Макарова"}          | ${1}
  `(`correctly filters rows due to different filter types`, ({ filterType, filter, result }) => {
    const columnKey = "fullname";

    const rows: TableData = model.data;
    const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
    if (!column) {
      throw new Error("no such column!");
    }
    const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
    filterTask.setType(filterType as FilterType);
    filterTask.setValue("Василиса Макарова");

    const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));

    expect(filteredRows.length).toBe(result);
  });
  // it("correctly performs eq (equality) check", async () => {
  //   const columnKey = "fullname";
  //
  //   const rows: TableData = model.data;
  //   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
  //   if (!column) {
  //     throw new Error("no such column!");
  //   }
  //
  //   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
  //   filterTask.setType("eq");
  //   filterTask.setValue("Василиса Макарова");
  //
  //   const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));
  //
  //   expect(filteredRows.length).toBe(1);
  // });
  //
  // it("correctly performs sw (startsWith) check", async () => {
  //   const columnKey = "fullname";
  //
  //   const rows: TableData = model.data;
  //   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
  //   if (!column) {
  //     throw new Error("no such column!");
  //   }
  //
  //   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
  //   filterTask.setType("sw");
  //   filterTask.setValue("Василиса");
  //
  //   const filteredRows: TableData = rows.filter((row: TableRow) => {
  //     if (row[columnKey]) {
  //       return filterTask.apply(row);
  //     }
  //     return false;
  //   });
  //   expect(filteredRows.length).toBe(1);
  // });
  //
  // it("correctly performs ew (endsWith) check", async () => {
  //   const columnKey = "fullname";
  //
  //   const rows: TableData = model.data;
  //   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
  //   if (!column) {
  //     throw new Error("no such column!");
  //   }
  //
  //   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
  //   filterTask.setType("ew");
  //   filterTask.setValue("Савельев");
  //
  //   const filteredRows: TableData = rows.filter((row: TableRow) => {
  //     if (row[columnKey]) {
  //       return filterTask.apply(row);
  //     }
  //     return false;
  //   });
  //
  //   expect(filteredRows.length).toBe(1);
  // });
  //
  // it("correctly performs has (includes) check", async () => {
  //   const columnKey = "fullname";
  //
  //   const rows: TableData = model.data;
  //   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
  //   if (!column) {
  //     throw new Error("no such column!");
  //   }
  //
  //   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
  //   filterTask.setType("has");
  //   filterTask.setValue("Макарова");
  //
  //   const filteredRows: TableData = rows.filter((row: TableRow) => {
  //     if (row[columnKey]) {
  //       return filterTask.apply(row);
  //     }
  //     return false;
  //   });
});

// it.each`
//   filterType | filterName
//   ${'gt'}    | ${'greater than'}
//   ${'gte'}   | ${'greater than or equal'}
//   ${'lt'}    | ${'less than'}
//   ${'lte'}   | ${'less than or equal'}
// `('excludes all rows on $filterType ($filterName) check', ({ filterType, filterName }) => {
//   const columnKey = 'fullname';
//
//   const rows: TableData = model.data;
//   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
//   if (!column) {
//     throw new Error('no such column!');
//   }
//   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
//   filterTask.setType(filterType as FilterType);
//   filterTask.setValue('Василиса Макарова');
//
//   const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));
//
//   expect(filteredRows.length).toBe(0);
// });
//
// it('excludes all rows on range check', () => {
//   const columnKey = 'fullname';
//
//   const rows: TableData = model.data;
//   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
//   if (!column) {
//     throw new Error('no such column!');
//   }
//
//   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
//   filterTask.setType('range');
//   filterTask.setRangeValues(['Василиса Макарова', 'Тамара Павлова']);
//
//   const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));
//
//   expect(filteredRows.length).toBe(0);
// });
//
// it('excludes all rows on any (any matching factor level) check', () => {
//   const columnKey = 'fullname';
//
//   const rows: TableData = model.data;
//   const column: TableColumn | undefined = getColumnMetadata(model, columnKey);
//   if (!column) {
//     throw new Error('no such column!');
//   }
//
//   const filterTask = new FilterTask(column.key, column.name, column.type, column.levels);
//   filterTask.setType('any');
//   filterTask.setMultipleValues(['Василиса Макарова', 'Тамара Павлова']);
//
//   const filteredRows: TableData = rows.filter((row: TableRow) => filterTask.apply(row));
//
//   expect(filteredRows.length).toBe(0);
// });
// });
