<template>
  <div class="relative flex min-h-screen flex-col">
    <!-- Navbar -->
    <nav class="bg-teal-600">
      <div class="mx-auto px-4">
        <div class="relative flex h-16 items-center justify-between">
          <!-- Logo section -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img class="h-8 w-auto text-white" :src="logo" alt="Your Company" />
            </div>
          </div>
          <div class="h-10 flex gap-2 items-center">
            <div
              v-if="!areTrialsLoaded"
              class="h-7 w-7 rounded-full border-4 border-l-white border-t-white border-r-white border-b-teal-600 animate-spin"
            ></div>

            <trial-select
              :trials="trials"
              :selected-trial-idx="selectedTrialIdx"
              :disabled="!areTrialsLoaded"
              :class="[areTrialsLoaded ? '' : 'opacity-50 cursor-default']"
              class="hidden lg:block"
              @update="updateSelectedTrialIdx"
            />
            <button
              :class="[selectedTrialIdx > -1 ? 'hover:bg-teal-800' : 'opacity-50 cursor-default']"
              class="inline-flex items-center min-w-max rounded-lg border border-transparent bg-teal-900 px-4 py-2 font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              @click="createQuery"
            >
              <plus-icon class="-ml-2 mr-1 h-6 w-6"></plus-icon>Новый запрос
            </button>
          </div>
        </div>
      </div>
    </nav>

    <query-edit-overlay
      :is-visible="isQueryEditOverlayVisible"
      :schema="reactiveCompleteSchema"
      @change="toggleCompleteSchemaField"
      @sendQuery="getDataFromQuery"
      @cancel="cancelQueryEdit"
      class="hidden lg:block"
    />

    <!-- 3 column wrapper -->
    <div
      class="w-full h-full flex items-center justify-center p-3 bg-slate-300 lg:hidden"
      style="height: calc(100vh - 4rem)"
    >
      <div class="w-full px-4 py-6 text-center bg-gray-50 rounded-xl">
        <tv-icon class="mx-auto h-16 w-16 text-gray-600" aria-hidden="true" />
        <h3 class="mt-1 text-lg font-semibold text-gray-900">
          Приложение поддерживает работу только на широких экранах!
        </h3>
        <p class="mt-4 text-gray-600">Чтобы приступить к анализу данных, откройте эту страницу на компьютере.</p>
      </div>
    </div>

    <div
      class="hidden mx-auto w-full flex-grow bg-slate-300 lg:flex lg:flex-row"
      style="max-height: calc(100vh - 4rem)"
    >
      <div
        class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-900 cursor-pointer hover:text-slate-700"
        @click="toggleQueryVisibility"
      >
        <chevron-double-right-icon v-if="queryHidden" class="h-6 w-6 cursor-pointer"></chevron-double-right-icon>
        <chevron-double-left-icon v-else class="h-6 w-6 cursor-pointer"></chevron-double-left-icon>
        <p class="font-semibold" style="writing-mode: vertical-rl; transform: scale(-1)">Запрос и фильтры</p>
      </div>

      <div v-if="!queryHidden" class="pl-4 py-4 basis-1/5 flex-shrink-0 flex-grow-0 flex flex-col 2xl:pr-4">
        <div class="h-1/2 flex flex-col overflow-hidden">
          <div class="ml-2 mb-2 text-slate-700 text-xl font-semibold">
            <p class="text-xl font-semibold">Запрос</p>
          </div>
          <div
            class="h-full flex flex-col rounded-xl overflow-hidden"
            :class="[reactiveSchema.length > 0 ? 'bg-white' : 'bg-gray-50']"
          >
            <query-navbar-top :is-query-active="ncol > 0" @edit-query="editQuery" />
            <div class="flex-1 flex justify-center rounded-b-xl overflow-auto">
              <query-list
                v-if="reactiveSchema.length > 0"
                :schema="reactiveSchema"
                @toggleColumnVisibility="toggleColumnVisibility"
              />
              <div v-else class="w-full p-3">
                <p class="text-sm text-gray-700 text-center">Нет данных для отображения</p>
              </div>
            </div>
          </div>
        </div>

        <div class="h-1/2 mt-4 flex flex-col">
          <div class="ml-2 mb-2 text-slate-700 text-xl font-semibold">
            <p class="text-xl font-semibold">Фильтры</p>
          </div>
          <div class="h-full rounded-xl overflow-hidden" :class="[filterTasks.length > 0 ? 'bg-white' : 'bg-gray-50']">
            <filter-navbar-top :is-filter-active="filterTasks.length > 0" @clearFilters="clearFilters" />
            <div class="flex justify-center overflow-auto" style="height: calc(100% - 4rem)">
              <filter-list
                v-if="filterTasks.length > 0"
                :tasks="filterTasks"
                @updateType="updateFilterType"
                @updateValue="updateValue"
                @updateRangeValues="updateRangeValues"
                @updateMultipleValues="updateMultipleValues"
                @remove="removeFilter"
              />
              <div v-else class="w-full p-3">
                <p class="text-sm text-gray-700 text-center">Нет фильтров для отображения</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-2 p-4 flex-1 flex flex-col">
        <p class="ml-2 mb-2 text-slate-700 text-xl font-semibold">Результат запроса</p>
        <div class="h-full rounded-xl bg-white overflow-hidden">
          <query-result-navbar-top
            :ncol="ncol"
            :nrow="nrow"
            :is-sort-active="isSortActive"
            @clearSort="clearSort"
            @save="saveQueryResultTable"
          />
          <div id="queryResultTable" class="relative w-full overflow-auto" style="height: calc(100% - 8rem)">
            <div v-if="ncol > 0" class="absolute min-w-max">
              <query-result-table
                :reactive-schema="reactiveSchema"
                :table="filteredSortedAndPaginatedTable"
                :current-page="currentPage"
                :limit="limit"
                @sort="toggleSort"
                @filter="toggleFilter"
                @stats="toggleStats"
              />
            </div>
            <div v-else class="w-full h-full flex items-center justify-center p-3 bg-gray-50">
              <div class="text-center">
                <cube-transparent-icon class="mx-auto h-20 w-20 text-gray-600" aria-hidden="true" />
                <h3 class="mt-3 mb-6 text-lg font-semibold text-gray-900">Нет данных для отображения</h3>
                <p class="inline text-gray-600">
                  Чтобы начать анализ данных, выберите исследование в верхнем правом углу
                </p>
                <p class="mt-1 inline-flex items-center text-gray-600 cursor-text">
                  экрана и нажмите на кнопку
                  <span class="ml-2 inline-flex items-center py-1 pl-1 pr-2 rounded-md border border-gray-400">
                    <plus-icon class="inline mr-0.5 h-5 w-5" aria-hidden="true" />
                    Новый запрос</span
                  >
                </p>
              </div>
            </div>
          </div>
          <query-result-navbar-bottom
            :nrow="nrow"
            :limit="limit"
            :current-page="currentPage"
            :max-page="maxPage"
            @update="setPage"
          />
        </div>
      </div>

      <div v-if="!statisticsHidden" class="pr-4 py-4 basis-1/5 flex-shrink-0 flex-grow-0 flex flex-col 2xl:pl-4">
        <div class="flex mb-2 ml-2 items-center justify-between text-slate-700">
          <p class="text-xl font-semibold">Статистика</p>
        </div>

        <div
          class="h-full rounded-xl overflow-hidden"
          :class="[stats.variable && filteredTable.length > 0 ? 'bg-white' : 'bg-gray-50']"
        >
          <statistics-navbar-top
            :variable="stats.variable"
            :has-data="filteredTable.length > 0"
            @save="saveStatsTable"
          />
          <div class="relative flex justify-center p-3 overflow-auto" style="height: calc(100% - 8rem)">
            <div class="w-full">
              <statistics-table
                v-if="stats.variable && filteredTable.length > 0"
                :variable="stats.variable"
                :data="stats.data"
              />
              <p v-else class="text-sm text-gray-700 text-center">Нет данных для отображения</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-900 cursor-pointer hover:text-slate-700"
        @click="toggleStatisticsVisibility"
      >
        <chevron-double-left-icon v-if="statisticsHidden" class="h-6 w-6 cursor-pointer"></chevron-double-left-icon>
        <chevron-double-right-icon v-else class="h-6 w-6 cursor-pointer"></chevron-double-right-icon>
        <p class="font-semibold" style="writing-mode: vertical-rl; transform: scale(-1)">Статистика</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // TODO: check on how everything manages with NA data
  // TODO: feedback button and initial alert about fake data / evaluation purposes

  import { ref, computed, watch, onMounted } from 'vue';
  import { sort } from 'fast-sort';
  import { TvIcon, CubeTransparentIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';
  import { PlusIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/20/solid';
  import logo from './assets/RWE-BI-logo.svg';
  import type {
    ReactiveTableSchemaInfo,
    ReactiveTableSchema,
    TableSchema,
    TableRow,
    TableData,
    DataQuery,
    TableSchemaInfo,
  } from './data/types';
  import { APIRouter } from './data/Router';
  import type { Trial } from './data/Router';
  import { FilterTask } from './classes/FilterTask';
  import type { FilterType } from './classes/FilterTask';
  import { SortTask } from './classes/SortTask';
  import { ColumnStats } from './classes/ColumnStats';

  import TrialSelect from './components/TrialSelect.vue';
  import QueryEditOverlay from './components/QueryEditOverlay.vue';
  import QueryNavbarTop from './components/QuerySummaryNavbarTop.vue';
  import QueryList from './components/QueryList.vue';
  import FilterNavbarTop from './components/FilterNavbarTop.vue';
  import FilterList from './components/FilterList.vue';
  import QueryResultNavbarTop from './components/QueryResultNavbarTop.vue';
  import QueryResultNavbarBottom from './components/QueryResultNavbarBottom.vue';
  import QueryResultTable from './components/QueryResultTable.vue';
  import StatisticsNavbarTop from './components/StatisticsNavbarTop.vue';
  import StatisticsTable from './components/StatisticsTable.vue';
  import { XlsxExport } from './classes/XlsxExport';

  const areTrialsLoaded = ref(false);
  const queryHidden = ref(false);
  const statisticsHidden = ref(false);
  function toggleQueryVisibility() {
    queryHidden.value = !queryHidden.value;
  }
  function toggleStatisticsVisibility() {
    statisticsHidden.value = !statisticsHidden.value;
  }

  const isQueryEditOverlayVisible = ref(false);
  const isNewQuery = ref(false);
  function toggleQueryEditOverlayVisibility() {
    isQueryEditOverlayVisible.value = !isQueryEditOverlayVisible.value;
  }

  const apiRouter = new APIRouter();
  const trials = ref<Trial[]>([]);

  onMounted(async () => {
    areTrialsLoaded.value = false;
    trials.value = await apiRouter.getTrials();
    areTrialsLoaded.value = true;
  });

  const selectedTrialIdx = ref(-1);
  function updateSelectedTrialIdx(idx: number) {
    selectedTrialIdx.value = idx;
  }

  let completeSchema: ReactiveTableSchemaInfo = [];
  let completeSchemaBackup: ReactiveTableSchemaInfo = [];
  function addReactivity(completeSchema: TableSchemaInfo) {
    return completeSchema
      .filter((column) => !column.isServiceColumn)
      .map((columnInfo) => ({
        ...columnInfo,
        selected: false,
      }));
  }
  const reactiveCompleteSchema = ref<ReactiveTableSchemaInfo>(completeSchema);
  function backupReactiveCompleteSchema() {
    completeSchemaBackup = completeSchema.map((columnInfo) => ({ ...columnInfo }));
  }
  function restoreReactiveCompleteSchema() {
    completeSchema = completeSchemaBackup.map((columnInfo) => ({ ...columnInfo }));
    reactiveCompleteSchema.value = completeSchema.map((columnInfo) => ({ ...columnInfo }));
  }

  async function createQuery() {
    if (selectedTrialIdx.value < 0) return;
    backupReactiveCompleteSchema();
    completeSchema = addReactivity(await apiRouter.getCompleteSchema(trials.value[selectedTrialIdx.value].key));
    reactiveCompleteSchema.value = completeSchema.map((columnInfo) => ({ ...columnInfo }));
    isNewQuery.value = true;
    toggleQueryEditOverlayVisibility();
  }

  function editQuery() {
    backupReactiveCompleteSchema();
    isNewQuery.value = false;
    toggleQueryEditOverlayVisibility();
  }

  function cancelQueryEdit() {
    toggleQueryEditOverlayVisibility();
    restoreReactiveCompleteSchema();
  }

  function toggleCompleteSchemaField(at: { originKey: string; columnKey: string }) {
    let columnIdx = completeSchema.findIndex(
      (column) => column.origin.key === at.originKey && column.key === at.columnKey
    );
    completeSchema[columnIdx].selected = !completeSchema[columnIdx].selected;

    columnIdx = reactiveCompleteSchema.value.findIndex(
      (column) => column.origin.key === at.originKey && column.key === at.columnKey
    );
    reactiveCompleteSchema.value[columnIdx].selected = !reactiveCompleteSchema.value[columnIdx].selected;
  }

  async function getDataFromQuery() {
    const query: DataQuery = reactiveCompleteSchema.value
      .filter((column) => column.selected)
      .map((column) => ({
        trialKey: trials.value[selectedTrialIdx.value].key,
        modelKey: column.origin.key,
        columnKey: column.key,
      }));
    const dbData = await apiRouter.getDataFromQuery(query);
    schema.value = dbData.schema;
    data.value = dbData.data;
    currentPage.value = 1;

    if (isNewQuery.value) {
      clearStats();
      clearSort();
      clearFilters();

      reactiveSchema.value = schema.value
        .filter((column) => column.type !== 'id')
        .sort((columnA, columnB) => {
          return (
            columnA.origin.priority - columnB.origin.priority ||
            columnA.origin.name.localeCompare(columnB.origin.name) ||
            columnA.position - columnB.position
          );
        })
        .map((column) => ({
          ...column,
          hasFilter: false,
          hasSort: 'NONE',
          hasStats: false,
          invisible: false,
        }));
    } else {
      const oldColumnKeys = new Set<string>(reactiveSchema.value.map((column) => column.key));
      const newColumnKeys = new Set<string>(dbData.schema.map((column) => column.key));
      const columnsToRemove = reactiveSchema.value.filter((column) => !newColumnKeys.has(column.key));
      const columnsToAdd = dbData.schema
        .filter((column) => column.type !== 'id')
        .filter((column) => !oldColumnKeys.has(column.key));

      columnsToRemove.forEach((column) => {
        if (column.hasStats) clearStats();
        if (column.hasSort) removeSort(column.key);
        if (column.hasFilter) {
          const filterTaskIdx = filterTasks.value.findIndex((task) => task.columnKey === column.key);
          removeFilter(filterTaskIdx);
        }
      });

      reactiveSchema.value = reactiveSchema.value
        .filter((column) => newColumnKeys.has(column.key))
        .concat(
          columnsToAdd.map((column) => ({
            ...column,
            hasFilter: false,
            hasSort: 'NONE',
            hasStats: false,
            invisible: false,
          }))
        )
        .sort((columnA, columnB) => {
          return (
            columnA.origin.priority - columnB.origin.priority ||
            columnA.origin.name.localeCompare(columnB.origin.name) ||
            columnA.position - columnB.position
          );
        });
      statsForColumnAtIndex.value = reactiveSchema.value.findIndex((column) => column.hasStats);
    }

    isQueryEditOverlayVisible.value = false;
  }

  const schema = ref<TableSchema>([]);
  const data = ref<TableData>([]);
  const reactiveSchema = ref<ReactiveTableSchema>([]);

  function toggleColumnVisibility(columnKey: string) {
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === columnKey);
    reactiveSchema.value[columnIdx].invisible = !reactiveSchema.value[columnIdx].invisible;
  }

  const limit = 100;
  const currentPage = ref(1);
  const maxPage = computed<number>(() => Math.ceil(filteredTable.value.length / limit) || 1);
  const ncol = computed(() => reactiveSchema.value.length);
  const nrow = computed(() => filteredTable.value.length);
  function setPage(page: number) {
    if (page > 0 && page <= maxPage.value) {
      currentPage.value = page;
    }
  }

  const filteredTable = computed<TableData>(() => {
    return data.value.filter((row) => {
      return filterTasks.value.every((task) => task.apply(row));
    });
  });

  const filteredAndSortedTable = computed<TableData>(() => {
    if (sortTasks.value.length === 0) return filteredTable.value;

    return sort(filteredTable.value).by(
      sortTasks.value.map((st) => {
        return st.direction === 'ASC' ? { asc: (row) => row[st.key] } : { desc: (row) => row[st.key] };
      })
    );
  });

  const filteredSortedAndPaginatedTable = computed<TableData>(() => {
    return filteredAndSortedTable.value.slice(limit * (currentPage.value - 1), limit * currentPage.value);
  });

  onMounted(() => {
    watch(filteredSortedAndPaginatedTable, () => {
      const tableEl = document.getElementById('queryResultTable');
      tableEl!.scrollTo(tableEl!.scrollLeft, 0);
    });
  });

  const filterTasks = ref<FilterTask[]>([]);

  function toggleFilter(columnKey: string) {
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === columnKey);
    const columnName = reactiveSchema.value[columnIdx].name;
    const columnType = reactiveSchema.value[columnIdx].type;
    const columnLevels = reactiveSchema.value[columnIdx].levels;
    const filterTaskIdx = filterTasks.value.findIndex((task) => task.columnKey === columnKey);

    if (filterTaskIdx === -1) {
      reactiveSchema.value[columnIdx].hasFilter = true;
      const filterTask = new FilterTask(columnKey, columnName, columnType, columnLevels);
      filterTasks.value.push(filterTask);
    } else {
      filterTasks.value.splice(filterTaskIdx, 1);
      reactiveSchema.value[columnIdx].hasFilter = false;
    }
  }

  function updateFilterType(filterTaskIdx: number, filterType: FilterType) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.setType(filterType);
    if (filterTask.value) currentPage.value = 1;
  }

  function updateValue(filterTaskIdx: number, value: string | number | Date) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.setValue(value);
    currentPage.value = 1;
  }

  function updateRangeValues(
    filterTaskIdx: number,
    rangeValues: [number | Date | undefined, number | Date | undefined]
  ) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.setRangeValues(rangeValues);
    currentPage.value = 1;
  }

  function updateMultipleValues(filterTaskIdx: number, values: string[]) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.setMultipleValues(values);
    currentPage.value = 1;
  }

  function removeFilter(filterTaskIdx: number) {
    const filterTask = filterTasks.value[filterTaskIdx];
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === filterTask.columnKey);
    filterTasks.value.splice(filterTaskIdx, 1);
    reactiveSchema.value[columnIdx].hasFilter = false;
    currentPage.value = 1;
  }

  function clearFilters() {
    while (filterTasks.value.length > 0) {
      const filterTask = filterTasks.value.pop();
      const columnIdx = reactiveSchema.value.findIndex((column) => column.key === filterTask!.columnKey);
      reactiveSchema.value[columnIdx].hasFilter = false;
    }
    currentPage.value = 1;
  }

  const sortTasks = ref<SortTask[]>([]);
  const isSortActive = computed(() => sortTasks.value.length > 0);

  function toggleSort(columnKey: string) {
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === columnKey);
    const sortTaskIndex = sortTasks.value.findIndex((task) => task.key === columnKey);

    if (sortTaskIndex === -1) {
      sortTasks.value.push(new SortTask(columnKey, 'ASC'));
      reactiveSchema.value[columnIdx].hasSort = 'ASC';

      reactiveSchema.value[columnIdx].sortPriority = sortTasks.value.length;
    } else {
      const sortTask = sortTasks.value[sortTaskIndex];
      if (sortTask.direction === 'ASC') {
        sortTasks.value[sortTaskIndex].setDirection('DESC');
        reactiveSchema.value[columnIdx].hasSort = 'DESC';
      } else {
        removeSort(columnKey);
      }
    }
  }

  function removeSort(columnKey: string) {
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === columnKey);
    const sortTaskIndex = sortTasks.value.findIndex((task) => task.key === columnKey);

    if (sortTaskIndex !== -1) {
      sortTasks.value.splice(sortTaskIndex, 1);
      reactiveSchema.value[columnIdx].hasSort = 'NONE';
      reactiveSchema.value[columnIdx].sortPriority = undefined;

      const sortTasksToUpdatePriority = sortTasks.value.slice(sortTaskIndex);
      sortTasksToUpdatePriority.forEach((st) => {
        const columnIndex = reactiveSchema.value.findIndex((column) => column.key === st.key);
        reactiveSchema.value[columnIndex].sortPriority! -= 1;
      });
    }
  }

  function clearSort() {
    while (sortTasks.value.length > 0) {
      const sortTask = sortTasks.value.pop() as SortTask;
      const columnIndex = reactiveSchema.value.findIndex((column) => column.key === sortTask.key);
      reactiveSchema.value[columnIndex].hasSort = 'NONE';
      reactiveSchema.value[columnIndex].sortPriority = undefined;
    }
    currentPage.value = 1;
  }

  const statsForColumnAtIndex = ref(-1);
  const columnStats = new ColumnStats();

  const stats = computed(() => {
    if (statsForColumnAtIndex.value < 0) {
      return columnStats.empty();
    }

    const columnMetadata = reactiveSchema.value[statsForColumnAtIndex.value];
    const columnValues = filteredTable.value.map((row) => row[columnMetadata.key]);

    return columnStats.calculate(columnMetadata, columnValues);
  });

  function toggleStats(columnKey: string) {
    const columnIdx = reactiveSchema.value.findIndex((column) => column.key === columnKey);
    if (statsForColumnAtIndex.value < 0) {
      statsForColumnAtIndex.value = columnIdx;
      reactiveSchema.value[statsForColumnAtIndex.value].hasStats = true;
    } else {
      reactiveSchema.value[statsForColumnAtIndex.value].hasStats = false;
      if (columnIdx === statsForColumnAtIndex.value) {
        statsForColumnAtIndex.value = -1;
      } else {
        statsForColumnAtIndex.value = columnIdx;
        reactiveSchema.value[statsForColumnAtIndex.value].hasStats = true;
      }
    }
  }

  function clearStats() {
    if (statsForColumnAtIndex.value > 0) {
      reactiveSchema.value[statsForColumnAtIndex.value].hasStats = false;
      statsForColumnAtIndex.value = -1;
    }
  }

  async function saveTable(schema: TableSchema, data: TableData, sheetName: string, fileName: string) {
    const xlsxExport = new XlsxExport();
    await xlsxExport.generateXLSX(schema, data, sheetName, fileName);
  }

  function saveQueryResultTable() {
    const schema = reactiveSchema.value.filter((column) => !column.invisible);
    const colnames = schema.map((column) => column.name);
    const visibleKeys = schema.map((column) => column.key);
    const data = filteredAndSortedTable.value.map((row) => {
      const keys = Object.keys(row);
      return keys.reduce((visibleRow: TableRow, key) => {
        if (visibleKeys.includes(key)) visibleRow[key] = row[key];
        return visibleRow;
      }, {});
    });
    saveTable(schema, data, 'Данные', 'результаты_запроса');
  }

  function saveStatsTable() {
    const schema: TableSchema = [
      {
        origin: {
          key: 'stats',
          name: 'Статистика',
          priority: 0,
        },
        key: 'param',
        name: 'Параметр',
        type: 'text',
        position: 0,
      },
      {
        origin: {
          key: 'stats',
          name: 'Статистика',
          priority: 0,
        },
        key: 'value',
        name: 'Значение',
        type: 'text',
        position: 1,
      },
    ];
    const data = stats.value.data as TableData;
    const filename = stats.value.variable.toLowerCase().replace(/[^а-яa-z0-9_-]/, '_');
    saveTable(schema, data, 'Статистика', filename);
  }
</script>
