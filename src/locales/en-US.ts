const messages = {
  meta: {
    title: 'Analytic system for clinical trial data',
    description:
      'A BI system for clinical trial data, providing extensive capabilities for data processing. Enables researchers to discover initial insights and prepare data for further analysis in statistical software.',
  },
  buttons: {
    group: 'Group data',
    edit_groups: 'Edit groups',
    ungroup: 'Ungroup',
  },
  tabs: {
    query_and_filters: 'Queries and filters',
    statistics: 'Statistics',
  },
  titles: {
    query: 'Query',
    filters: 'Filters',
    query_results: 'Query results',
    statistics: 'Statistics',
  },
  no_data_main: {
    notice: 'No data to display',
    todo: {
      select_trial: 'To start data analysis, select a trial',
      upper_right_corner: 'in the upper right corner',
      screen: 'of the screen',
      press_button: 'and press the button',
    },
  },
  wide_screen: {
    notice: 'The application only supports operation on wide screens!',
    todo: 'To start data analysis, open this page on a computer.',
  },
  no_data: 'No data to display',
  trial: {
    select_trial: '- select a trial -',
    trial_info: '{name} (as of {updated_at})',
  },
  query: {
    query: 'Query',
    available_data: 'Available data',
    no_data: 'No data to display',
    select_all: 'Select all',
    remove_all: 'Remove all',
    create: 'New query',
    edit: 'Edit',
    cancel: 'Cancel',
    submit: 'Run query',
  },
  query_result: {
    records_found: 'Your query matches {n} records | Your query matches {n} record | Your query matches {n} records',
    record_count_on_page: 'Showing records {rowNumberStart} – {rowNumberEnd} of {nrow}',
    page: 'Page',
    out_of: 'of',
    export: 'Export',
    no_data: 'No data to display',
  },
  sorting: {
    clear: 'Clear sorting',
  },
  filters: {
    remove: 'Remove',
    remove_all: 'Remove all',
    range_from: 'from',
    range_to: 'to',
    enter_value: 'Enter value',
    options: {
      select_filter: '- select a filter -',
      text: {
        eq: 'exact match',
        sw: 'starts with',
        has: 'contains',
        ew: 'ends with',
      },
      number: {
        eq: 'equals',
        gt: 'greater than',
        gte: 'greater than or equal to',
        lt: 'less than',
        lte: 'less than or equal to',
        range: 'range',
      },
      date: {
        eq: 'equals',
        gt: 'greater than',
        gte: 'greater than or equal to',
        lt: 'less than',
        lte: 'less than or equal to',
        range: 'range',
      },
      factor: {
        any: 'value from list',
        sw: 'starts with',
        has: 'contains',
        ew: 'ends with',
      },
    },
  },
  grouping: {
    select_grouping_columns: 'Select grouping columns:',
    select_grouping_actions: 'Specify data to show for other columns:',
    no_data: 'No data to display',
    enter_value: 'Enter value',
    perform_grouping: 'Perform grouping',
    cancel: 'Cancel',
    actions: {
      short: {
        hide: '(hide)',
        count: '(count)',
        first: '(first value)',
        last: '(last value)',
        nth: '(position {groupingParam})',
        sum: '(sum)',
        mean: '(mean)',
        median: '(median)',
        all: '(all values)',
        unique: '(unique values)',
      },
      long: {
        hide: 'hide',
        count: 'count',
        first: 'first value',
        last: 'last value',
        nth: 'nth value',
        sum: 'sum',
        mean: 'mean',
        median: 'median',
        all: 'all values',
        unique: 'unique values',
      },
      placeholders: {
        index_number: 'index number',
        separator: 'separator',
      },
    },
  },
  stats: {
    param: 'Parameter',
    value: 'Value',
    count: 'Count',
    non_empty_count: 'Non-empty values',
    min: 'Minimum',
    lq: 'First quartile',
    median: 'Median',
    uq: 'Third quartile',
    max: 'Maximum',
    iqr: 'Interquartile range',
    mean: 'Mean',
    sd: 'Standard deviation',
    na: 'No data',
    export: 'Export',
  },
  export: {
    data: {
      file_name: 'Query results',
      sheet_name: 'Data',
    },
    stats: {
      sheet_name: 'Statistics',
      schema: {
        origin_name: 'Statistics',
        param_name: 'Parameter',
        value_name: 'Value',
      },
    },
  },
  demo_trials: {
    breast: 'RWE MCT: Breast Cancer',
    melanoma: 'MCT: Melanoma',
  },
};

export default messages;
