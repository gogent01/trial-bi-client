export const comorbiditySchema = [
    {
        key: 'id',
        name: 'Код',
        type: 'id',
        primaryKey: 'comorbidities',
    },
    {
        key: 'patient_id',
        name: 'Код пациента',
        type: 'id',
        belongsTo: 'patients',
    },
    {
        key: 'category',
        name: 'Вид заболевания',
        type: 'factor',
        levels: ['Онкологическое заболевание', 'Аутоиммунное заболевание', 'Другое'],
    },
    {
        key: 'comment',
        name: 'Комментарий',
        type: 'text',
    },
].map((column, idx) => (Object.assign({ origin: { key: 'comorbidities', name: 'Сопутствующие заболевания', priority: 1 }, position: idx }, column)));
