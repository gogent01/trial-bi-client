import type { ReactiveTableColumn, TableData, TableRow } from '../data/types';

export type ExportColumn = { key: string; header: string };
export type ExportSheet = { name: string; columns: ExportColumn[]; rows: TableData };

/** Export header of a data column: its result key, plus the grouping action for grouped columns */
export function exportKey(column: ReactiveTableColumn): string {
  const action = column.aggregation?.action;
  if (!action || action === 'group' || action === 'hide' || action === 'none') return column.key;
  if (action === 'nth') {
    const position = parseInt(column.aggregation?.param || '1', 10);
    return `${column.key}.nth${isNaN(position) ? '' : position}`;
  }
  return `${column.key}.${action}`;
}

/** File name for a column's statistics: "-" instead of "." so the name doesn't look like a file extension */
export function statsFileName(column: ReactiveTableColumn): string {
  return exportKey(column).replace(/\./g, '-');
}

/** Rows of the codebook sheet: what each exported column means */
export function codebookRows(columns: ReactiveTableColumn[]): TableData {
  return columns.map((column) => ({
    key: exportKey(column),
    table: column.origin.name,
    column: column.name,
    type: column.type,
  }));
}

function cellLength(value: TableRow[string]): number {
  if (value instanceof Date) return value.toLocaleDateString().length;
  return (value ?? '').toString().length;
}

/** Column widths that fit the header and the content, between 10 and 30 characters plus a margin */
export function columnWidths(columns: ExportColumn[], rows: TableData): number[] {
  return columns.map(({ key, header }) => {
    const contentWidth = rows.reduce((width, row) => Math.max(cellLength(row[key]), width), 10);
    return Math.min(Math.max(header.length, contentWidth), 30) + 1;
  });
}

export class XlsxExport {
  constructor() {}

  async generateXLSX(sheets: ExportSheet[], fileName: string) {
    if (sheets.length === 0 || sheets[0].rows.length === 0) return;

    const XLSX = await import('exceljs');
    const workbook = new XLSX.Workbook();

    sheets.forEach((sheet) => {
      const worksheet = workbook.addWorksheet(sheet.name);
      const widths = columnWidths(sheet.columns, sheet.rows);

      worksheet.columns = sheet.columns.map((column, idx) => ({
        key: column.key,
        header: column.header,
        width: widths[idx],
      }));
      worksheet.addRows(sheet.rows);
      worksheet.eachRow({ includeEmpty: true }, (row, rowIdx) => {
        row.eachCell((cell) => {
          if (rowIdx === 1) {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
          } else {
            cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
          }
        });
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
