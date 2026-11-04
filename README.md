# Trial BI

[![CI](https://github.com/gogent01/trial-bi-client/actions/workflows/ci.yml/badge.svg)](https://github.com/gogent01/trial-bi-client/actions/workflows/ci.yml)

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

Live demo: https://trial-bi-client.vercel.app

This repository contains only the front-end of the system. By default it uses an internal demonstration source of randomly generated data (`DemoRouter` in `src/data/Router.ts`). The client for the backend is also implemented (`APIRouter`, a REST API under `/api/1.0`), and there is an option to modify code for retrieving data from locally uploaded files.

To use the backend instead of the demo data, set `VITE_DATA_SOURCE=api` (for example, in `.env.local`). In development, Vite proxies `/api` requests to `http://localhost:3000`.

In the full system, a daily ETL job transforms the contents of the operational trial database into DuckDB, and the backend serves that data to this client.

### Technologies
- TypeScript, Vue 3 (Composition API, `<script setup>`), Vite
- Tailwind CSS, Headless UI, Heroicons
- vue-i18n (English and Russian, picked from the browser language)
- simple-statistics, fast-sort, ExcelJS
- Vitest

### Installation and Launch

The project uses [pnpm](https://pnpm.io) (run `corepack enable` to get the version pinned in `package.json`).

```bash
pnpm install
pnpm start
```

Standard scripts for a Vue project:

```bash
pnpm type-check # type correctness checks
pnpm build # build the application to './dist' folder
pnpm lint # lint and auto-fix
```

Tests have been written for the complex classes (data filtering and descriptive statistics calculation) and for pluralization rules. They are located in the `__tests__` folder. To run tests in watch mode use the following command:

```bash
pnpm test
```

### Continuous Integration

Every push to `main` and every pull request runs type checks, linting (`pnpm lint:check`, which fails on any warning), tests (`pnpm test:ci`) and a production build in GitHub Actions (`.github/workflows/ci.yml`). Dependabot (`.github/dependabot.yml`) opens a monthly pull request with grouped minor and patch updates; major upgrades are done manually, while security updates arrive regardless.

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
