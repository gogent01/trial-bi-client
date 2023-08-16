export function getColumnMetadata(model, columnKey) {
    return model.schema.find((column) => column.key === columnKey);
}
export function getColumnValues(model, columnKey) {
    return model.data.map((row) => row[columnKey]);
}
