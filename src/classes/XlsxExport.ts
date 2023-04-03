import type { TableData, TableSchema } from '@/data/types';
import * as XLSX from 'exceljs';

export class XlsxExport {
  constructor() {}

  async generateXLSX(schema: TableSchema, data: TableData, sheetName: string, fileName: string) {
    if (data.length === 0) return;

    const workbook = new XLSX.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    const colkeys = Object.keys(data[0]);
    const colwidths = colkeys.map((key) =>
      data.reduce((width, row) => {
        const charLength =
          row[key] instanceof Date
            ? (row[key]! as Date).toLocaleDateString().length
            : (row[key] || '').toString().length;
        return Math.max(charLength, width);
      }, 10)
    );

    worksheet.columns = schema.map((column, idx) => ({
      key: column.key,
      header: column.name,
      width: Math.min(Math.max(column.name.length, colwidths[idx]), 30) + 1,
    }));
    worksheet.addRows(data);
    worksheet.eachRow({ includeEmpty: true }, (row, idx) => {
      row.eachCell((cell) => {
        if (idx === 1) {
          cell.font = { bold: true };
          cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        } else {
          cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
