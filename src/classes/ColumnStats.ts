import type { TableColumn } from '@/data/types';
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
      this.data = [{ param: 'Число наблюдений', value: columnValues.length.toString() }];
    } else if (columnMetadata.type === 'number') {
      const values = (columnValues as number[]).filter((value) => value !== null);
      this.data = [
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
    } else if (columnMetadata.type === 'text') {
      const values = (columnValues as string[]).filter((value) => value !== null);
      this.data = [
        { param: 'Число наблюдений', value: columnValues.length.toString() },
        { param: 'Заполненных значений', value: values.length.toString() },
      ];
    } else if (columnMetadata.type === 'factor') {
      const values = (columnValues as string[]).filter((value) => value !== null);
      this.data = [
        { param: 'Число наблюдений', value: columnValues.length.toString() },
        { param: 'Заполненных значений', value: values.length.toString() },
      ]
        .concat(
          columnMetadata
            .levels!.filter((level) => level !== null && level !== 'Нет данных')
            .map((level) => ({
              param: level,
              value: (values as string[]).filter((value) => value === level).length.toString(),
            }))
        )
        .concat([
          {
            param: 'Нет данных',
            value: (columnValues as string[])
              .filter((value) => value === null || value === 'Нет данных')
              .length.toString(),
          },
        ]);
    } else if (columnMetadata.type === 'date') {
      const values = (columnValues as Date[]).filter((value) => value !== null);
      this.data = [
        { param: 'Число наблюдений', value: columnValues.length.toString() },
        { param: 'Заполненных значений', value: values.length.toString() },
        { param: 'Минимум', value: new Date(min(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
        { param: 'Максимум', value: new Date(max(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
      ];
    }

    return this;
  }

  pretty(n: number): string {
    return n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '.0');
  }

  empty(): this {
    this.variable = '';
    this.data = [] as StatsRow[];
    return this;
  }
}
