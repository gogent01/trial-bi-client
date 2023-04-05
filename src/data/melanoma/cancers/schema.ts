import type { ColumnType, TableSchema } from '@/data/types';

export const cancerSchema: TableSchema = [
  {
    key: 'id',
    name: 'Код',
    type: 'id' as ColumnType,
    primaryKey: 'cancers',
  },
  {
    key: 'patient_id',
    name: 'Код пациента',
    type: 'id' as ColumnType,
    belongsTo: 'patients',
  },
  {
    key: 'localization',
    name: 'Локализация первичной опухоли',
    type: 'factor' as ColumnType,
    levels: [
      'Меланома кожи',
      'Меланома слизистых',
      'Увеальная меланома',
      'Меланома без выявленного первичного очага',
      'Меланома конъюнктивы',
      'Меланома кожи века',
    ],
  },
  {
    key: 'localization_comment',
    name: 'Локализация первичной опухоли: комментарий',
    type: 'text' as ColumnType,
  },
  {
    key: 'date_of_symptoms',
    name: 'Дата первых симптомов',
    type: 'date' as ColumnType,
  },
  {
    key: 'date_of_diagnosis',
    name: 'Дата постановки диагноза',
    type: 'date' as ColumnType,
  },
  {
    key: 'ldh',
    name: 'Уровень ЛДГ (на момент постановки диагноза)',
    type: 'number' as ColumnType,
  },
  {
    key: 'stage_T',
    name: 'Стадия по оси T (на момент постановки диагноза)',
    type: 'factor' as ColumnType,
    levels: ['0', 'is(DCIS)', 'is(LCIS)', '1', '2', '3', '4a', '4b', '4c', '4d'],
  },
  {
    key: 'stage_N',
    name: 'Стадия по оси N (на момент постановки диагноза)',
    type: 'factor' as ColumnType,
    levels: ['X', '0', '1', '2', '2a', '2b', '3', '3a', '3b', '3c'],
  },
  {
    key: 'stage_M',
    name: 'Стадия по оси M (на момент постановки диагноза)',
    type: 'factor' as ColumnType,
    levels: ['0', '1'],
  },
  {
    key: 'stage',
    name: 'Стадия (на момент постановки диагноза)',
    type: 'factor' as ColumnType,
    levels: ['0', 'I A', 'I B', 'II A', 'II B', 'III A', 'III B', 'III C', 'IV'],
  },
].map((column, idx) => ({
  origin: { key: 'cancers', name: 'Онкозаболевание', priority: 1 },
  position: idx,
  ...column,
}));
