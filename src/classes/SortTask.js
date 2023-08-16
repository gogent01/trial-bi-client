export class SortTask {
    constructor(columnKey, direction) {
        Object.defineProperty(this, "key", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "direction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.key = columnKey;
        this.direction = direction;
    }
    setDirection(direction) {
        this.direction = direction;
    }
}
