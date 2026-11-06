import { iqr, max, mean, median, min, quantile, standardDeviation } from 'simple-statistics';
import i18n from '../services/i18n';
import type { TableColumn } from '../data/types';
import { CURRENT_LOCALE } from '../config/variables';
import { formatNumber, formatStat, roundNumber } from '../services/numbers';

const { t } = i18n.global;

export type StatsRow = {
  param: string;
  value: string;
  exportValue: number | string;
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
    return [this.countRow(t('stats.count'), 0)];
  }

  private buildNumberStats(columnValues: number[]): StatsRow[] {
    const values = this.removeNAs<number>(columnValues);
    return [
      this.countRow(t('stats.count'), columnValues.length),
      this.countRow(t('stats.non_empty_count'), values.length),
      this.statRow(t('stats.min'), min(values)),
      this.statRow(t('stats.lq'), quantile(values, 0.25)),
      this.statRow(t('stats.median'), median(values)),
      this.statRow(t('stats.uq'), quantile(values, 0.75)),
      this.statRow(t('stats.max'), max(values)),
      this.statRow(t('stats.iqr'), iqr(values)),
      this.statRow(t('stats.mean'), mean(values)),
      this.statRow(t('stats.sd'), standardDeviation(values)),
    ];
  }

  private buildTextStats(columnValues: string[]): StatsRow[] {
    const values = this.removeNAs<string>(columnValues);
    return [
      this.countRow(t('stats.count'), columnValues.length),
      this.countRow(t('stats.non_empty_count'), values.length),
    ];
  }

  private buildFactorStats(columnValues: string[], columnLevels: string[]): StatsRow[] {
    const values = this.removeNAs<string>(columnValues);
    return [
      this.countRow(t('stats.count'), columnValues.length),
      this.countRow(t('stats.non_empty_count'), values.length),
    ]
      .concat(
        columnLevels
          .filter((level) => level !== null && level !== t('stats.na'))
          .map((level) => this.countRow(this.toSentenceCase(level), values.filter((value) => value === level).length))
      )
      .concat([
        this.countRow(
          t('stats.na'),
          columnValues.filter((value) => value === undefined || value === null || value === t('stats.na')).length
        ),
      ]);
  }

  private buildDateStats(columnValues: Date[]): StatsRow[] {
    const values = this.removeNAs<Date>(columnValues);
    return [
      this.countRow(t('stats.count'), columnValues.length),
      this.countRow(t('stats.non_empty_count'), values.length),
      this.textRow(t('stats.min'), new Date(min(values.map((d) => d.getTime()))).toLocaleDateString(CURRENT_LOCALE)),
      this.textRow(t('stats.max'), new Date(max(values.map((d) => d.getTime()))).toLocaleDateString(CURRENT_LOCALE)),
    ];
  }

  private removeNAs<T>(columnValues: T[]): T[] {
    return columnValues.filter((value) => value !== null && value !== undefined);
  }

  private countRow(param: string, count: number): StatsRow {
    return { param, value: formatNumber(count), exportValue: count };
  }

  private statRow(param: string, n: number): StatsRow {
    return { param, value: formatStat(n), exportValue: roundNumber(n) };
  }

  private textRow(param: string, text: string): StatsRow {
    return { param, value: text, exportValue: text };
  }

  private toSentenceCase(s: string): string {
    return s[0].toUpperCase() + s.slice(1);
  }
}
