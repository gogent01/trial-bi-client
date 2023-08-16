export class FilterTask {
    constructor(columnKey, columnName, columnType, columnLevels) {
        Object.defineProperty(this, "columnKey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "columnName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "columnType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "columnLevels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "value", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "multipleValues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "rangeValues", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.columnKey = columnKey;
        this.columnName = columnName;
        this.columnType = columnType;
        this.columnLevels = columnLevels;
        this.multipleValues = [];
        this.rangeValues = [undefined, undefined];
    }
    clone() {
        const clonedFilterTask = new FilterTask(this.columnKey, this.columnName, this.columnType, this.columnLevels);
        clonedFilterTask.setValue(this.value);
        clonedFilterTask.setMultipleValues(this.multipleValues);
        clonedFilterTask.setRangeValues(this.rangeValues);
        return clonedFilterTask;
    }
    setType(filterType) {
        this.type = filterType;
    }
    setValue(value) {
        this.value = value;
    }
    setRangeValues(rangeValues) {
        this.rangeValues = rangeValues;
    }
    setMultipleValues(values) {
        this.multipleValues = values;
    }
    isEmpty() {
        if (this.type === 'range') {
            return this.rangeValues[0] === undefined && this.rangeValues[1] === undefined;
        }
        else if (this.type === 'any') {
            return this.multipleValues.length === 0;
        }
        return this.value === undefined;
    }
    apply(row) {
        if (this.isEmpty())
            return true;
        if (this.columnType === 'text') {
            const cellValue = (row[this.columnKey] || '');
            if (this.type === 'eq')
                return cellValue === this.value;
            if (this.type === 'sw')
                return cellValue.startsWith(this.value);
            if (this.type === 'ew')
                return cellValue.endsWith(this.value);
            if (this.type === 'has')
                return cellValue.includes(this.value);
        }
        else if (this.columnType === 'number') {
            const cellValue = row[this.columnKey];
            if (cellValue === undefined || cellValue === null || isNaN(cellValue))
                return false;
            if (this.type === 'eq')
                return cellValue === this.value;
            if (this.type === 'gt')
                return cellValue > this.value;
            if (this.type === 'gte')
                return cellValue >= this.value;
            if (this.type === 'lt')
                return cellValue < this.value;
            if (this.type === 'lte')
                return cellValue <= this.value;
            if (this.type === 'range')
                return (cellValue >= (this.rangeValues[0] || Number.NEGATIVE_INFINITY) &&
                    cellValue < (this.rangeValues[1] || Number.POSITIVE_INFINITY));
        }
        else if (this.columnType === 'date') {
            const cellValue = (row[this.columnKey] || new Date(NaN));
            if (cellValue.toString() === 'Invalid Date')
                return false;
            if (this.type === 'eq')
                return cellValue.toDateString() === this.value.toDateString();
            if (this.type === 'gt')
                return cellValue > this.value;
            if (this.type === 'gte')
                return cellValue >= this.value;
            if (this.type === 'lt')
                return cellValue < this.value;
            if (this.type === 'lte')
                return cellValue <= this.value;
            if (this.type === 'range')
                return (cellValue >= (this.rangeValues[0] || Number.NEGATIVE_INFINITY) &&
                    cellValue < (this.rangeValues[1] || Number.POSITIVE_INFINITY));
        }
        else if (this.columnType === 'factor') {
            const cellValue = (row[this.columnKey] || '');
            if (this.type === 'sw')
                return cellValue.startsWith(this.value);
            if (this.type === 'ew')
                return cellValue.endsWith(this.value);
            if (this.type === 'has')
                return cellValue.includes(this.value);
            if (this.type === 'any')
                return this.multipleValues.indexOf(cellValue) >= 0;
        }
        return false;
    }
}
