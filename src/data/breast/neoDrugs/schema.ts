import type { ColumnType, TableSchema } from '../../types';

export const neoDrugSchema: TableSchema = [
  {
    key: 'id',
    name: 'ID',
    type: 'id' as ColumnType,
    primaryKey: 'neo_therapies',
  },
  {
    key: 'neo_therapy_id',
    name: 'Therapy ID',
    type: 'id' as ColumnType,
    belongsTo: 'neo_therapies',
  },
  {
    key: 'drug_name',
    name: 'Drug name',
    type: 'factor' as ColumnType,
    levels: ['TCHP', 'Docetaxel', 'Paclitaxel', 'Trastuzumab', 'Carboplatin'],
  },
  {
    key: 'dose',
    name: 'Dose',
    type: 'number' as ColumnType,
  },
  {
    key: 'units',
    name: 'Units',
    type: 'factor' as ColumnType,
    levels: ['mg', 'mg/kg', 'ME'],
  },
  {
    key: 'courses',
    name: 'Courses',
    type: 'number' as ColumnType,
  },
  {
    key: 'commentary',
    name: 'Commentary',
    type: 'text' as ColumnType,
  },
].map((column, idx) => ({
  origin: { key: 'neo_drugs', name: 'Neoadjuvant chemotherapy drugs', priority: 3 },
  position: idx,
  ...column,
}));
