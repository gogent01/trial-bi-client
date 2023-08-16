export declare class SortTask {
    key: string;
    direction: 'ASC' | 'DESC';
    constructor(columnKey: string, direction: 'ASC' | 'DESC');
    setDirection(direction: 'ASC' | 'DESC'): void;
}
