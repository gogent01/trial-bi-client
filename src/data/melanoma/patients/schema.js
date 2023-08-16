export const patientSchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'patients',
    },
    {
        key: 'center',
        name: 'МО',
        type: 'factor',
        levels: ['МКНЦ им. А.С. Логинова', 'ГКОБ 1', 'ГКОБ 62'],
    },
    {
        key: 'fullname',
        name: 'ФИО',
        type: 'text',
    },
    {
        key: 'gender',
        name: 'Пол',
        type: 'factor',
        levels: ['Мужской', 'Женский'],
    },
    {
        key: 'history',
        name: 'Номер ИБ',
        type: 'text',
    },
    {
        key: 'date_of_birth',
        name: 'Дата рождения',
        type: 'date',
    },
    {
        key: 'age',
        name: 'Возраст',
        type: 'number',
    },
    {
        key: 'status',
        name: 'Жизненный статус',
        type: 'factor',
        levels: [
            'Лечение проводится',
            'Лечение завершено планово',
            'Лечение отменено',
            'Отзыв согласия на наблюдение',
            'Зарегистрирована смерть',
        ],
    },
].map((column, idx) => (Object.assign({ origin: { key: 'patients', name: 'Пациенты', priority: 0 }, position: idx }, column)));
