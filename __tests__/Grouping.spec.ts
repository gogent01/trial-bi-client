import { describe, expect, it, vi } from 'vitest';
import { compressRowGroup } from '../src/classes/Grouping';
import type { ColumnType, GroupingAction, GroupingReactiveTableColumn, TableRow } from '../src/data/types';

vi.mock('../src/config/variables', () => ({ CURRENT_LOCALE: 'en-US' }));

function column(key: string, type: ColumnType, action: GroupingAction, param?: string): GroupingReactiveTableColumn {
  return {
    origin: { key: 'patients', name: 'Patients', priority: 0 },
    position: 0,
    key,
    name: key,
    type,
    hasFilter: false,
    hasSort: 'NONE',
    hasStats: false,
    grouping: { action, param },
  };
}

function summarize(rows: TableRow[], key: string, type: ColumnType, action: GroupingAction, param?: string) {
  return compressRowGroup(rows, [column(key, type, action, param)])[key];
}

const rows: TableRow[] = [
  { age: 40, site: 'Skin', date: new Date('2023-01-10T12:00:00Z'), width: 0 },
  { age: 60, site: 'Eye', date: new Date('2023-01-10T15:00:00Z'), width: undefined },
  { age: 50, site: 'Skin', date: new Date('2023-02-01T12:00:00Z'), width: 3 },
  { age: 30, site: undefined, date: undefined, width: 3 },
];

describe('Grouping: numeric summaries', () => {
  it('calculates the median of an even number of values', () => {
    expect(summarize(rows, 'age', 'number', 'median')).toBe(45);
  });

  it('calculates the median of two values', () => {
    expect(summarize(rows.slice(0, 2), 'age', 'number', 'median')).toBe(50);
  });

  it('calculates the median of an odd number of values', () => {
    expect(summarize(rows.slice(0, 3), 'age', 'number', 'median')).toBe(50);
  });

  it('ignores missing values in sum and mean', () => {
    expect(summarize(rows, 'width', 'number', 'sum')).toBe(6);
    expect(summarize(rows, 'width', 'number', 'mean')).toBe(2);
  });

  it('counts rows', () => {
    expect(summarize(rows, 'age', 'number', 'count')).toBe(4);
  });
});

describe('Grouping: lists of values', () => {
  it('keeps zero values instead of showing them as missing', () => {
    expect(summarize(rows, 'width', 'number', 'all')).toBe('0; 3; 3; NA');
  });

  it('uses a custom separator', () => {
    expect(summarize(rows, 'site', 'text', 'all', ', ')).toBe('Eye, Skin, Skin, NA');
  });

  it('lists unique values', () => {
    expect(summarize(rows, 'site', 'text', 'unique')).toBe('Eye; Skin; NA');
  });

  it('formats dates and lists each day once', () => {
    expect(summarize(rows, 'date', 'date', 'unique')).toBe('1/10/2023; 2/1/2023; NA');
  });
});
