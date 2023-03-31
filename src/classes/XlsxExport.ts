import type { TableData, TableSchema } from '@/data/types';
import * as XLSX from 'xlsx';

export class XlsxExport {
  constructor() {}

  generateXLSX(data: TableData, colnames: string[], sheetName: string, fileName: string) {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [colnames], { origin: 'A1' });

    /* calculate column width */
    // const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
    worksheet['!cols'] = [{ wch: 20 }];

    /* create an XLSX file and try to save to Данные.xlsx */
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
