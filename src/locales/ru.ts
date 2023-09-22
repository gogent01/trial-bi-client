const messages = {
  buttons: {
    new_query: 'Новый запрос',
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
  grouping_actions: {
    hide: '(посл. знач.)',
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
  },
};

export default messages;
