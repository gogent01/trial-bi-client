export const histologicCharacteristicSchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'histologic_characteristics',
    },
    {
        key: 'cancer_id',
        name: 'Код онкозаболевания',
        type: 'id',
        belongsTo: 'cancers',
    },
    {
        key: 'form',
        name: 'Форма роста',
        type: 'factor',
        levels: ['Узловая', 'Поверхностно распространающаяся', 'Лентиго', 'Другое'],
    },
    {
        key: 'pigmentation',
        name: 'Наличие пигмента',
        type: 'factor',
        levels: ['Да', 'Нет', 'Нет данных'],
    },
    {
        key: 'clark',
        name: 'Уровень инвазии по Кларку',
        type: 'factor',
        levels: ['I', 'II', 'III', 'IV', 'V'],
    },
    {
        key: 'height',
        name: 'Толщина опухоли, мм',
        type: 'number',
    },
].map((column, idx) => (Object.assign({ origin: { key: 'histologic_characteristics', name: 'Гистологическая характеристика', priority: 2 }, position: idx }, column)));
