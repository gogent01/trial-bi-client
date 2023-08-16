export const neoDrugSchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'neo_therapies',
    },
    {
        key: 'neo_therapy_id',
        name: 'Код неоадъювантной терапии',
        type: 'id',
        belongsTo: 'neo_therapies',
    },
    {
        key: 'drug_name',
        name: 'Название препарата',
        type: 'factor',
        levels: ['Схема: TCHP', 'Доцетаксел', 'Паклитаксел', 'Трастузумаб', 'Карбоплатин'],
    },
    {
        key: 'dose',
        name: 'Доза',
        type: 'number',
    },
    {
        key: 'units',
        name: 'Единицы измерения',
        type: 'factor',
        levels: ['мг', 'мг/кг', 'ЕД'],
    },
    {
        key: 'courses',
        name: 'Число курсов',
        type: 'number',
    },
    {
        key: 'commentary',
        name: 'Комментарий',
        type: 'text',
    },
].map((column, idx) => (Object.assign({ origin: { key: 'neo_drugs', name: 'Препараты неоадъювантной терапии', priority: 3 }, position: idx }, column)));
