import type { TableColumn } from '../data/types';
import { iqr, max, mean, median, min, quantile, standardDeviation } from 'simple-statistics';

export type StatsRow = {
  param: string;
  value: string;
};

export class ColumnStats {
  variable: string;
  data: StatsRow[];

  constructor() {
    this.variable = '';
    this.data = [] as StatsRow[];
  }

  calculate(columnMetadata: TableColumn, columnValues: unknown[]): this {
    this.variable = columnMetadata.name;

    if (columnValues.length === 0) {
      this.data = this.buildEmptyStats();
    } else if (columnMetadata.type === 'number') {
      this.data = this.buildNumberStats(columnValues as number[]);
    } else if (columnMetadata.type === 'text') {
      this.data = this.buildTextStats(columnValues as string[]);
    } else if (columnMetadata.type === 'factor') {
      this.data = this.buildFactorStats(columnValues as string[], columnMetadata.levels!);
    } else if (columnMetadata.type === 'date') {
      this.data = this.buildDateStats(columnValues as Date[]);
    }

    return this;
  }

  empty(): this {
    this.variable = '';
    this.data = [] as StatsRow[];
    return this;
  }

  private buildEmptyStats(): StatsRow[] {
    return [{ param: 'Число наблюдений', value: '0' }];
  }

  private buildNumberStats(columnValues: number[]): StatsRow[] {
    const values = this.removeNAs<number>(columnValues);
    return [
      { param: 'Число наблюдений', value: columnValues.length.toString() },
      { param: 'Заполненных значений', value: values.length.toString() },
      { param: 'Минимум', value: this.pretty(min(values)) },
      { param: 'Первый квартиль', value: this.pretty(quantile(values, 0.25)) },
      { param: 'Медиана', value: this.pretty(median(values)) },
      { param: 'Третий квартиль', value: this.pretty(quantile(values, 0.75)) },
      { param: 'Максимум', value: this.pretty(max(values)) },
      { param: 'Межкварт. интервал', value: this.pretty(iqr(values)) },
      { param: 'Среднее', value: this.pretty(mean(values)) },
      { param: 'Станд. отклонение', value: this.pretty(standardDeviation(values)) },
    ];
  }

  private buildTextStats(columnValues: string[]): StatsRow[] {
    const values = this.removeNAs<string>(columnValues);
    return [
      { param: 'Число наблюдений', value: columnValues.length.toString() },
      { param: 'Заполненных значений', value: values.length.toString() },
    ];
  }

  private buildFactorStats(columnValues: string[], columnLevels: string[]): StatsRow[] {
    const values = this.removeNAs<string>(columnValues);
    return [
      { param: 'Число наблюдений', value: columnValues.length.toString() },
      { param: 'Заполненных значений', value: values.length.toString() },
    ]
      .concat(
        columnLevels
          .filter((level) => level !== null && level !== 'Нет данных')
          .map((level) => ({
            param: this.toSentenceCase(level),
            value: (values as string[]).filter((value) => value === level).length.toString(),
          }))
      )
      .concat([
        {
          param: 'Нет данных',
          value: (columnValues as string[])
            .filter((value) => value === undefined || value === null || value === 'Нет данных')
            .length.toString(),
        },
      ]);
  }

  private buildDateStats(columnValues: Date[]): StatsRow[] {
    const values = this.removeNAs<Date>(columnValues);
    return [
      { param: 'Число наблюдений', value: columnValues.length.toString() },
      { param: 'Заполненных значений', value: values.length.toString() },
      { param: 'Минимум', value: new Date(min(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
      { param: 'Максимум', value: new Date(max(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
    ];
  }

  private removeNAs<T>(columnValues: T[]): T[] {
    return columnValues.filter((value) => value !== null && value !== undefined);
  }

  private pretty(n: number): string {
    return n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '.0');
  }

  private toSentenceCase(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }
}
