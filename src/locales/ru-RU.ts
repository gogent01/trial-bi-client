const messages = {
  buttons: {
    group: 'Группировать данные',
    edit_groups: 'Редактировать группы',
    ungroup: 'Разгруппировать данные',
  },
  tabs: {
    query_and_filters: 'Запросы и фильтры',
    statistics: 'Статистика',
  },
  titles: {
    query: 'Запрос',
    filters: 'Фильтры',
    query_results: 'Результаты запроса',
    statistics: 'Статистика',
  },
  no_data_main: {
    notice: 'Нет данных для отображения',
    todo: {
      select_trial: 'Чтобы начать анализ данных, выберите исследование в верхнем правом углу',
      press_button: 'экрана и нажмите на кнопку',
    },
  },
  wide_screen: {
    notice: 'Приложение поддерживает работу только на широких экранах!',
    todo: 'Чтобы приступить к анализу данных, откройте эту страницу на компьютере.',
  },
  no_data: 'Нет данных для отображения',
  trial: {
    select_trial: '- выберите исследование -',
    trial_info: '{name} (от {updated_at})',
  },
  query: {
    query: 'Запрос',
    available_data: 'Доступные данные',
    no_data: 'Нет данных для отображения',
    select_all: 'Выбрать все',
    remove_all: 'Убрать все',
    create: 'Новый запрос',
    edit: 'Редактировать',
    cancel: 'Отменить',
    submit: 'Отправить запрос',
  },
  query_result: {
    records_found:
      'По вашему запросу было найдено {n} записей | По вашему запросу была найдена {n} запись | По вашему запросу было найдено {n} записи | По вашему запросу было найдено {n} записей',
    record_count_on_page: 'Показаны записи {rowNumberStart} – {rowNumberEnd} из {nrow}',
    page: 'Страница',
    out_of: 'из',
    export: 'Сохранить',
    no_data: 'Нет данных для отображения',
  },
  sorting: {
    clear: 'Сбросить сортировку',
  },
  filters: {
    remove: 'Удалить',
    remove_all: 'Удалить все',
    range_from: 'от',
    range_to: 'до',
    enter_value: 'Введите значение',
    options: {
      select_filter: '- выберите фильтр -',
      text: {
        eq: 'точное соответствие',
        sw: 'начинается с',
        has: 'содержит',
        ew: 'заканчивается на',
      },
      number: {
        eq: 'равно',
        gt: 'больше',
        gte: 'больше или равно',
        lt: 'меньше',
        lte: 'меньше или равно',
        range: 'диапазон',
      },
      date: {
        eq: 'равно',
        gt: 'больше',
        gte: 'больше или равно',
        lt: 'меньше',
        lte: 'меньше или равно',
        range: 'диапазон',
      },
      factor: {
        any: 'значение из списка',
        sw: 'начинается с',
        has: 'содержит',
        ew: 'заканчивается на',
      },
    },
  },
  grouping: {
    select_grouping_columns: 'Выберите, по каким столбцам сгруппировать данные:',
    select_grouping_actions: 'Определите, какие данные показать для остальных столбцов:',
    no_data: 'Нет данных для отображения',
    enter_value: 'Введите значение',
    perform_grouping: 'Выполнить группировку',
    cancel: 'Отменить',
    actions: {
      short: {
        hide: '(скрыть)',
        count: '(кол-во набл.)',
        first: '(перв. знач.)',
        last: '(посл. знач.)',
        nth: '({groupingParam}-е знач.)',
        sum: '(сумма)',
        mean: '(среднее)',
        median: '(медиана)',
        all: '(все. знач.)',
        unique: '(уник. знач.)',
      },
      long: {
        hide: 'скрыть',
        count: 'количество наблюдений',
        first: 'первое значение',
        last: 'последнее значение',
        nth: 'значение по счету',
        sum: 'сумма',
        mean: 'среднее',
        median: 'медиана',
        all: 'все значения',
        unique: 'уникальные значения',
      },
      placeholders: {
        index_number: 'порядковый номер',
        separator: 'разделитель',
      },
    },
  },
  stats: {
    param: 'Параметр',
    value: 'Значение',
    count: 'Число наблюдений',
    non_empty_count: 'Заполненных значений',
    min: 'Минимум',
    lq: 'Первый квартиль',
    median: 'Медиана',
    uq: 'Третий квартиль',
    max: 'Максимум',
    iqr: 'Межкварт. интервал',
    mean: 'Среднее',
    sd: 'Станд. отклонение',
    na: 'Нет данных',
    export: 'Сохранить',
  },
  export: {
    data: {
      file_name: 'Результат запроса',
      sheet_name: 'Данные',
    },
    stats: {
      sheet_name: 'Статистика',
      schema: {
        origin_name: 'Статистика',
        param_name: 'Параметр',
        value_name: 'Значение',
      },
    },
  },
  demo_trials: {
    breast: 'Исследование RWE: рак молочной железы',
    melanoma: 'Исследование: меланома',
  },
};

export default messages;
