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
        key: 'bmi',
        name: 'ИМТ',
        type: 'number',
    },
].map((column, idx) => (Object.assign({ origin: { key: 'patients', name: 'Пациенты', priority: 0 }, position: idx }, column)));
