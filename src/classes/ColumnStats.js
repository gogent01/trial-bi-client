import { iqr, max, mean, median, min, quantile, standardDeviation } from 'simple-statistics';
export class ColumnStats {
    constructor() {
        Object.defineProperty(this, "variable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.variable = '';
        this.data = [];
    }
    calculate(columnMetadata, columnValues) {
        this.variable = columnMetadata.name;
        if (columnValues.length === 0) {
            this.data = this.buildEmptyStats();
        }
        else if (columnMetadata.type === 'number') {
            this.data = this.buildNumberStats(columnValues);
        }
        else if (columnMetadata.type === 'text') {
            this.data = this.buildTextStats(columnValues);
        }
        else if (columnMetadata.type === 'factor') {
            this.data = this.buildFactorStats(columnValues, columnMetadata.levels);
        }
        else if (columnMetadata.type === 'date') {
            this.data = this.buildDateStats(columnValues);
        }
        return this;
    }
    empty() {
        this.variable = '';
        this.data = [];
        return this;
    }
    buildEmptyStats() {
        return [{ param: 'Число наблюдений', value: '0' }];
    }
    buildNumberStats(columnValues) {
        const values = this.removeNAs(columnValues);
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
    buildTextStats(columnValues) {
        const values = this.removeNAs(columnValues);
        return [
            { param: 'Число наблюдений', value: columnValues.length.toString() },
            { param: 'Заполненных значений', value: values.length.toString() },
        ];
    }
    buildFactorStats(columnValues, columnLevels) {
        const values = this.removeNAs(columnValues);
        return [
            { param: 'Число наблюдений', value: columnValues.length.toString() },
            { param: 'Заполненных значений', value: values.length.toString() },
        ]
            .concat(columnLevels
            .filter((level) => level !== null && level !== 'Нет данных')
            .map((level) => ({
            param: this.toSentenceCase(level),
            value: values.filter((value) => value === level).length.toString(),
        })))
            .concat([
            {
                param: 'Нет данных',
                value: columnValues
                    .filter((value) => value === undefined || value === null || value === 'Нет данных')
                    .length.toString(),
            },
        ]);
    }
    buildDateStats(columnValues) {
        const values = this.removeNAs(columnValues);
        return [
            { param: 'Число наблюдений', value: columnValues.length.toString() },
            { param: 'Заполненных значений', value: values.length.toString() },
            { param: 'Минимум', value: new Date(min(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
            { param: 'Максимум', value: new Date(max(values.map((d) => d.getTime()))).toLocaleDateString('ru') },
        ];
    }
    removeNAs(columnValues) {
        return columnValues.filter((value) => value !== null && value !== undefined);
    }
    pretty(n) {
        return n.toFixed(3).replace(/0+$/, '').replace(/\.$/, '.0');
    }
    toSentenceCase(s) {
        return s[0].toUpperCase() + s.slice(1);
    }
}
