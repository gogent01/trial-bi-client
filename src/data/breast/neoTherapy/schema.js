export const neoTherapySchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'neo_therapies',
    },
    {
        key: 'cancer_id',
        name: 'Код онкозаболевания',
        type: 'id',
        belongsTo: 'cancers',
    },
    {
        key: 'start_date',
        name: 'Дата начала',
        type: 'date',
    },
    {
        key: 'end_date',
        name: 'Дата окончания',
        type: 'date',
    },
    {
        key: 'height',
        name: 'Рост, см',
        type: 'number',
    },
    {
        key: 'weight',
        name: 'Вес, кг',
        type: 'number',
    },
    {
        key: 'end_reason',
        name: 'Причина окончания терапии',
        type: 'factor',
        levels: [
            'Плановое окончание терапии',
            'Отказ пациента от терапии',
            'Нежелательные явления',
            'Прогрессирование',
            'Смерть',
        ],
    },
].map((column, idx) => (Object.assign({ origin: { key: 'neo_therapies', name: 'Неоадъювантная терапия', priority: 2 }, position: idx }, column)));
