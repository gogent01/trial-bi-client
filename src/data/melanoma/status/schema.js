export const lifeStatusSchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'life_statuses',
    },
    {
        key: 'patient_id',
        name: 'Код пациента',
        type: 'id',
        belongsTo: 'patients',
    },
    {
        key: 'contact_date',
        name: 'Дата контакта',
        type: 'date',
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
    {
        key: 'death_date',
        name: 'Дата смерти',
        type: 'date',
    },
    {
        key: 'death_cause',
        name: 'Причина смерти',
        type: 'factor',
        levels: [
            'Прогрессирование основного заболевания',
            'Другая опухоль',
            'Осложнение противоопухолевого лечения',
            'Другое заболевание',
            'Неизвестно',
        ],
    },
].map((column, idx) => (Object.assign({ origin: { key: 'life_statuses', name: 'Жизненный статус', priority: 1 }, position: idx }, column)));
