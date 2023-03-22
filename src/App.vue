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
          <div class="">
            <button
              class="inline-flex items-center rounded-lg border border-transparent bg-teal-900 px-4 py-2 font-medium text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <plus-icon class="-ml-2 mr-1 h-6 w-6"></plus-icon> Новый запрос
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 3 column wrapper -->
    <div
      class="mx-auto w-full flex-grow bg-slate-300 grid grid-rows-4 lg:flex lg:flex-row"
      style="max-height: calc(100vh - 4rem)"
    >
      <div
        class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-800 cursor-pointer hover:text-slate-700"
        @click="toggleQueryVisibility"
      >
        <chevron-double-right-icon v-if="queryHidden" class="h-6 w-6 cursor-pointer"></chevron-double-right-icon>
        <chevron-double-left-icon v-else class="h-6 w-6 cursor-pointer"></chevron-double-left-icon>
        <p class="font-semibold" style="writing-mode: vertical-rl; transform: scale(-1)">Запрос и фильтры</p>
      </div>

      <div v-if="!queryHidden" class="p-4 basis-1/5 flex-shrink-0 flex-grow-0 flex flex-col">
        <div class="h-3/5 flex flex-col">
          <div class="ml-2 mb-2 text-slate-700 text-xl font-semibold">
            <p class="text-xl font-semibold">Запрос</p>
          </div>
          <div class="h-full rounded-xl bg-white overflow-hidden">
            <query-navbar-top />
            <div class="flex justify-center overflow-auto" style="height: calc(100% - 8rem)">
              <div class="w-full p-3">
                <p class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
              </div>
            </div>
          </div>
        </div>
        <div class="h-2/5 mt-4 flex flex-col">
          <div class="ml-2 mb-2 text-slate-700 text-xl font-semibold">
            <p class="text-xl font-semibold">Фильтры</p>
          </div>
          <div class="h-full rounded-xl bg-white overflow-hidden">
            <filter-navbar-top :is-filter-active="isFilterActive" @clearFilters="clearFilters" />
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
                <p class="text-sm text-gray-600 text-center">Нет фильтров для отображения</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row-span-2 p-4 flex-1 flex flex-col">
        <p class="ml-2 mb-2 text-slate-700 text-xl font-semibold">Результат запроса</p>
        <div class="h-full rounded-xl bg-white overflow-hidden">
          <query-result-navbar-top :nrow="nrow" :is-sort-active="isSortActive" @clearSort="clearSort" />
          <div class="relative w-full overflow-auto" style="height: calc(100% - 8rem)">
            <div class="absolute min-w-max">
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

      <div v-if="!statisticsHidden" class="p-4 basis-1/5 flex-shrink-0 flex-grow-0 flex flex-col">
        <div class="flex mb-2 ml-2 items-center justify-between text-slate-700">
          <p class="text-xl font-semibold">Статистика</p>
        </div>

        <div class="h-full rounded-xl bg-white overflow-hidden">
          <statistics-navbar-top :variable="stats.variable" :has-data="filteredTable.length > 0" />
          <div class="relative flex justify-center p-3 overflow-auto" style="height: calc(100% - 8rem)">
            <div class="w-full">
              <statistics-table
                v-if="stats.variable && filteredTable.length > 0"
                :variable="stats.variable"
                :data="stats.data"
              />
              <p v-else class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-800 cursor-pointer hover:text-slate-700"
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
  import { ref, computed } from 'vue';
  import { sort } from 'fast-sort';
  import { PlusIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/20/solid';
  import logo from '@/assets/RWE-BI-logo.svg';
  import { ReactiveTableColumn, TableData } from '@/data/types';
  import { Database } from '@/data/Database';
  import { FilterTask, FilterType } from '@/classes/FilterTask';
  import { SortTask } from '@/classes/SortTask';
  import { ColumnStats } from '@/classes/ColumnStats';

  import QueryNavbarTop from '@/components/QuerySummaryNavbarTop.vue';
  import FilterNavbarTop from '@/components/FilterNavbarTop.vue';
  import FilterList from '@/components/FilterList.vue';
  import QueryResultNavbarTop from '@/components/QueryResultNavbarTop.vue';
  import QueryResultNavbarBottom from '@/components/QueryResultNavbarBottom.vue';
  import QueryResultTable from '@/components/QueryResultTable.vue';
  import StatisticsNavbarTop from '@/components/StatisticsNavbarTop.vue';
  import StatisticsTable from '@/components/StatisticsTable.vue';

  const queryHidden = ref(false);
  const statisticsHidden = ref(false);
  function toggleQueryVisibility() {
    queryHidden.value = !queryHidden.value;
  }
  function toggleStatisticsVisibility() {
    statisticsHidden.value = !statisticsHidden.value;
  }

  const database = new Database(200);
  const { schema, data } = database.getCancers();
  const reactiveSchema = ref<ReactiveTableColumn>(
    schema
      .filter((column) => !column.primaryKey && !column.belongsTo)
      .map((column) => ({
        ...column,
        hasFilter: false,
        hasSort: 'NONE',
        hasStats: false,
      }))
  );

  const limit = 100;
  const currentPage = ref(1);
  const maxPage = computed<number>(() => Math.ceil(filteredTable.value.length / limit) || 1);
  const nrow = computed(() => filteredTable.value.length);
  function setPage(page: number) {
    if (page > 0 && page <= maxPage.value) {
      currentPage.value = page;
    }
  }

  const filteredTable = computed<TableData>(() => {
    return data.filter((row) => {
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

  const filterTasks = ref<FilterTask[]>([]);
  const isFilterActive = computed(() => filterTasks.value.length > 0);

  function toggleFilter(columnIdx: number) {
    const columnKey = reactiveSchema.value[columnIdx].key;
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
    filterTask.updateType(filterType);
    if (filterTask.value) currentPage.value = 1;
  }

  function updateValue(filterTaskIdx: number, value: string | number | Date) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.updateValue(value);
    currentPage.value = 1;
  }

  function updateRangeValues(
    filterTaskIdx: number,
    rangeValues: [number | Date | undefined, number | Date | undefined]
  ) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.updateRangeValues(rangeValues);
    currentPage.value = 1;
  }

  function updateMultipleValues(filterTaskIdx: number, values: string[]) {
    const filterTask = filterTasks.value[filterTaskIdx];
    filterTask.updateMultipleValues(values);
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

  function toggleSort(columnIdx: number) {
    const columnKey = reactiveSchema.value[columnIdx].key;
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

  function toggleStats(columnIdx: number) {
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
</script>
