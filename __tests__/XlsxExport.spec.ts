import { describe, expect, it } from 'vitest';
import { codebookRows, columnWidths, exportKey, statsFileName } from '../src/classes/XlsxExport';
import type { ColumnType, GroupingAction, ReactiveTableColumn } from '../src/data/types';

function column(key: string, type: ColumnType, action?: GroupingAction, param?: string): ReactiveTableColumn {
  return {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 0,
    key,
    name: 'Weight, kg',
    type,
    hasFilter: false,
    hasSort: 'NONE',
    hasStats: false,
    aggregation: action ? { action, param } : undefined,
  };
}

describe('Export keys', () => {
  it('uses the result key for ungrouped and group-by columns', () => {
    expect(exportKey(column('patients.weight', 'number'))).toBe('patients.weight');
    expect(exportKey(column('patients.center', 'factor', 'group'))).toBe('patients.center');
  });

  it.each`
    action      | param        | key
    ${'count'}  | ${undefined} | ${'patients.weight.count'}
    ${'first'}  | ${undefined} | ${'patients.weight.first'}
    ${'last'}   | ${undefined} | ${'patients.weight.last'}
    ${'nth'}    | ${'3'}       | ${'patients.weight.nth3'}
    ${'nth'}    | ${undefined} | ${'patients.weight.nth1'}
    ${'sum'}    | ${undefined} | ${'patients.weight.sum'}
    ${'mean'}   | ${undefined} | ${'patients.weight.mean'}
    ${'median'} | ${undefined} | ${'patients.weight.median'}
    ${'all'}    | ${'; '}      | ${'patients.weight.all'}
    ${'unique'} | ${', '}      | ${'patients.weight.unique'}
  `('adds the grouping action "$action"', ({ action, param, key }) => {
    expect(exportKey(column('patients.weight', 'number', action as GroupingAction, param as string))).toBe(key);
  });
});

describe('Statistics file names', () => {
  it('uses "-" instead of "." as the separator', () => {
    expect(statsFileName(column('patients.weight', 'number'))).toBe('patients-weight');
    expect(statsFileName(column('patients.weight', 'number', 'mean'))).toBe('patients-weight-mean');
    expect(statsFileName(column('neo_therapies.height', 'number', 'nth', '2'))).toBe('neo_therapies-height-nth2');
  });
});

describe('Codebook sheet', () => {
  it('lists the export key, table, column name and type of each column', () => {
    const grouped = { ...column('patients.weight', 'number', 'mean'), name: 'Weight, kg (mean)' };

    expect(codebookRows([column('patients.center', 'factor', 'group'), grouped])).toEqual([
      { key: 'patients.center', table: 'Patients', column: 'Weight, kg', type: 'factor' },
      { key: 'patients.weight.mean', table: 'Patients', column: 'Weight, kg (mean)', type: 'number' },
    ]);
  });
});

describe('Export column widths', () => {
  it('fits the longer of header and content, between 10 and 30 characters plus a margin', () => {
    const columns = [
      { key: 'a', header: 'a' },
      { key: 'b', header: 'neo_therapies.height.median' },
      { key: 'c', header: 'c' },
    ];
    const rows = [
      { a: 1, b: 2, c: 'x'.repeat(50) },
      { a: undefined, b: undefined, c: 'short' },
    ];

    expect(columnWidths(columns, rows)).toEqual([11, 28, 31]);
  });
});
