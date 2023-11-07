# Trial BI

Trial BI is a system designed for analyzing data from clinical trials. It is intended to work with raw data collected during clinical trials to select data fragments for obtaining preliminary insights and exporting these fragments for further data analysis in specialized software.

### System Features

- Selection of clinical trials to retrieve data.
- Working with multi-table relational databases and single-table sources, such as *.xlsx files.
- Support for 4 types of variables: number, date, text, and factor.
- Sorting of data by multiple columns.
- Data filtering with multiple filter types depending on the data in a specific column ("equals," "not equals," "greater than," "greater than or equals," "less than," "less than or equals," "range," "starts with," "contains," "ends with," "values from the list").
- Data aggregation by one or multiple columns.
- Calculation of descriptive statistics for any data type.
- Export of data and descriptive statistics to *.xlsx files.

## Trial BI Client

This repository contains only the front-end of the system. In its current state, it connects to an internal demonstration source of randomly generated data. The code for retrieving data from the backend is also implemented, and there is an option to modify code for retrieving data from locally uploaded files.

### Technologies
- TypeScript
- Vue 3 + Pinia
- Tailwind CSS
- ExcelJS

### Installation and Launch

```bash
npm install
npm start
```

Standard scripts for a Vue project:

```bash
npm run type-check # type correctness checks
npm run build # build the application to './dist' folder
```

Tests have been written for the complex classes (data filtering and descriptive statistics calculation). They are located in the `__tests__` folder. To run tests use the following command:

```bash
npm run test
```

### Structure

The application is built as a Single Page Application (SPA) and has one screen for working with data (`src/App.vue`). Key components of the application include:
- Data selection modal: `src/components/QueryEditOverlay.vue`
- Data aggregation modal: `src/components/GroupingOverlay.vue`
- Data table: `src/components/QueryResultTable.vue`
- Column list: `src/components/QueryList.vue`
- Filter list: `src/components/FilterList.vue`
- Descriptive statistics table: `src/components/StatisticsTable.vue`

### User Journey

1. Choose a trial in the upper right corner of the screen and click the "New Query" button.
2. Select columns with data for display.
3. Apply filtering, sorting, and aggregation to the data; if necessary, modify the original query, undo changes, or create a new data query.
4. See descriptive statistics for columns of interest.
5. Export the modified data table and descriptive statistics tables in *.xlsx format.
