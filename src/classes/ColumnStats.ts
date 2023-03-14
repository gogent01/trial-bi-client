import type { FakeQueryColumn } from '@/data/fake';
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

  calculate(columnMetadata: FakeQueryColumn, columnValues: unknown[]): this {
    this.variable = columnMetadata.name;

    if (columnValues.length === 0) {
      this.data = [{ param: 'Число наблюдений', value: columnValues.length.toString() }];
    } else if (columnMetadata.type === 'number') {
      const values = columnValues as number[];
      this.data = [
        { param: 'Число наблюдений', value: values.length.toString() },
        { param: 'Минимум', value: this.pretty(min(values)) },
        { param: '1-ый квартиль', value: this.pretty(quantile(values, 0.25)) },
        { param: 'Медиана', value: this.pretty(median(values)) },
        { param: '3-ий квартиль', value: this.pretty(quantile(values, 0.75)) },
        { param: 'Максимум', value: this.pretty(max(values)) },
        { param: 'Межкварт. интервал', value: this.pretty(iqr(values)) },
        { param: 'Среднее', value: this.pretty(mean(values)) },
        { param: 'Станд. отклонение', value: this.pretty(standardDeviation(values)) },
      ];
    } else if (columnMetadata.type === 'text') {
      const values = columnValues as string[];
      this.data = [{ param: 'Число наблюдений', value: values.length.toString() }];
    } else if (columnMetadata.type === 'factor') {
      const values = columnValues as string[];
      this.data = [{ param: 'Число наблюдений', value: values.length.toString() }].concat(
        columnMetadata.levels!.map((level) => ({
          param: level,
          value: values.filter((value) => value === level).length.toString(),
        }))
      );
    } else if (columnMetadata.type === 'date') {
      const values = columnValues as Date[];
      this.data = [
        { param: 'Число наблюдений', value: values.length.toString() },
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
