export const surgerySchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'surgeries',
    },
    {
        key: 'cancer_id',
        name: 'Код онкозаболевания',
        type: 'id',
        belongsTo: 'cancers',
    },
    {
        key: 'aim',
        name: 'Цель хирургического лечения',
        type: 'factor',
        levels: ['Иссечение первичной опухоли', 'Метастазэктомия', 'Удаление рецидива'],
    },
    {
        key: 'date',
        name: 'Дата хирургического лечения',
        type: 'date',
    },
    {
        key: 'result',
        name: 'Исход хирургического лечения',
        type: 'factor',
        levels: ['Радикальное удаление', 'Циторедукция'],
    },
].map((column, idx) => (Object.assign({ origin: { key: 'surgeries', name: 'Хирургическое лечение', priority: 2 }, position: idx }, column)));
