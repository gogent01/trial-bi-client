<template>
  <!-- Background color split screen for large screens -->
<!--  <div class="fixed top-0 left-0 h-full w-1/2 bg-violet-400" aria-hidden="true" />-->
<!--  <div class="fixed top-0 right-0 h-full w-1/2 bg-green-400" aria-hidden="true" />-->
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
          <div class=''>
            <button class="inline-flex items-center rounded-lg border border-transparent bg-teal-900 px-4 py-2 font-medium text-white shadow-sm hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <plus-icon class="-ml-2 mr-1 h-6 w-6"></plus-icon> Новый запрос</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 3 column wrapper -->
    <div class="mx-auto w-full flex-grow bg-slate-300 grid grid-rows-4 lg:flex lg:flex-row" style="max-height: calc(100vh - 4rem);">

        <div class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-800 cursor-pointer hover:text-slate-700" @click="toggleQueryVisibility">
          <chevron-double-right-icon v-if="queryHidden" class="h-6 w-6 cursor-pointer"></chevron-double-right-icon>
          <chevron-double-left-icon v-else class="h-6 w-6 cursor-pointer"></chevron-double-left-icon>
          <p class="font-semibold" style="writing-mode: vertical-rl;transform: scale(-1);">Запрос и фильтры</p>
        </div>

        <div v-if="!queryHidden" class="p-4 basis-1/5 flex-shrink-0 flex flex-col">
          <div class="h-3/5 flex flex-col">
            <div class="ml-2 mb-2 text-slate-700 text-xl font-semibold">
              <p class="text-xl font-semibold">Запрос</p>
            </div>
            <div class="h-full rounded-xl bg-white overflow-hidden">
              <query-navbar-top />
              <div class="flex justify-center p-3 overflow-auto" style="height: calc(100% - 8rem);">
                <div class="w-full">
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
              <filter-navbar-top />
              <div class="flex justify-center p-3 overflow-auto" style="height: calc(100% - 8rem);">
                <div class="w-full">
                  <p class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div class="row-span-2 p-4 flex-1 flex flex-col">
        <p class="ml-2 mb-2 text-slate-700 text-xl font-semibold">Результат запроса</p>
        <div class="h-full rounded-xl bg-white overflow-hidden">
          <query-result-navbar-top :nrow="nrow"
                                   :is-sort-active="isSortActive"
                                   @clearSort="clearSort" />
          <div class="relative w-full overflow-auto" style="height: calc(100% - 8rem);">
            <div class="absolute min-w-max">
              <query-result-table :reactive-schema="reactiveSchema"
                                  :table="table"
                                  :current-page="currentPage"
                                  :limit="limit"
                                  @sort="toggleSort"
                                  @filter="toggleFilter"
                                  @stats="toggleStats" />
            </div>
          </div>
          <query-result-navbar-bottom :current-page="currentPage"
                                      :max-page="maxPage"
                                      @update="setPage" />
        </div>
      </div>

      <div v-if="!statisticsHidden" class="p-4 basis-1/5 flex-shrink-0 flex-grow-0 flex flex-col">
        <div class="flex mb-2 ml-2 items-center justify-between text-slate-700">
          <p class="text-xl font-semibold">Статистика</p>
        </div>

        <div class="h-full rounded-xl bg-white overflow-hidden">
          <statistics-navbar-top :variable="stats.variable" />
          <div class="relative flex justify-center p-3 overflow-auto" style="height: calc(100% - 8rem);">
            <div class="w-full">
              <statistics-table v-if="stats.variable"
                                :data="stats.data" />
              <p v-else class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-2 w-8 mx-auto bg-slate-400 flex flex-col gap-1 items-center text-slate-800 cursor-pointer hover:text-slate-700" @click="toggleStatisticsVisibility">
        <chevron-double-left-icon v-if="statisticsHidden" class="h-6 w-6 cursor-pointer"></chevron-double-left-icon>
        <chevron-double-right-icon v-else class="h-6 w-6 cursor-pointer"></chevron-double-right-icon>
        <p class="font-semibold" style="writing-mode: vertical-rl;transform: scale(-1);">Статистика</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { sort } from 'fast-sort';
  import { min, quantile, median, iqr, max, mean, standardDeviation } from 'simple-statistics';
  import { PlusIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/vue/20/solid';
  import { getData, ReactiveSchema, FakeQueryTable } from '@/data/fake';
  import logo from '@/assets/RWE-BI-logo.svg';

  import QueryNavbarTop from '@/components/QuerySummaryNavbarTop.vue';
  import FilterNavbarTop from '@/components/FilterNavbarTop.vue';
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

  const { schema, rows } = getData(550);
  const reactiveSchema = ref<ReactiveSchema>(schema.map(column => ({
    ...column,
    hasFilter: false,
    hasSort: 'NONE',
    hasStats: false,
  })));

  const limit = 100;
  const currentPage = ref(1);
  const maxPage = ref(Math.ceil(rows.length / limit));
  function setPage(page: number) {
    if (page > 0 && page <= maxPage.value) {
      currentPage.value = page;
    }
  }
  const nrow = computed(() => rows.length);

  const table = computed<FakeQueryTable> (() => {
    if (sortTasks.value.length === 0)
      return rows.slice(limit * (currentPage.value - 1), limit * currentPage.value);

    return sort(rows)
      .by(sortTasks.value.map((st) => {
        return st.direction === 'ASC'
          ? ({ asc: row => row[st.key] })
          : ({ desc: row => row[st.key] });
      }))
      .slice(limit * (currentPage.value - 1), limit * currentPage.value);
  });

  type SortTask = {
    key: string,
    direction: 'ASC' | 'DESC',
  };

  const sortTasks = ref<SortTask[]>([]);
  const isSortActive = computed(() => sortTasks.value.length > 0);

  function toggleFilter(columnIdx: number) {
    reactiveSchema.value[columnIdx].hasFilter = !reactiveSchema.value[columnIdx].hasFilter;
  }

  function toggleSort(columnIdx: number) {
    const columnKey = reactiveSchema.value[columnIdx].key;
    const sortTaskIndex = sortTasks.value.findIndex(task => task.key === columnKey);

    if (sortTaskIndex === -1) {
      sortTasks.value.push({ key: columnKey, direction: 'ASC' });
      reactiveSchema.value[columnIdx].hasSort = 'ASC';

      reactiveSchema.value[columnIdx].sortPriority = sortTasks.value.length;
    } else {
      const sortTask = sortTasks.value[sortTaskIndex];
      if (sortTask.direction === 'ASC') {
        sortTasks.value[sortTaskIndex].direction = 'DESC';
        reactiveSchema.value[columnIdx].hasSort = 'DESC';
      } else {
        sortTasks.value.splice(sortTaskIndex, 1);
        reactiveSchema.value[columnIdx].hasSort = 'NONE';
        reactiveSchema.value[columnIdx].sortPriority = undefined;

        const sortTasksToUpdatePriority = sortTasks.value.slice(sortTaskIndex);
        sortTasksToUpdatePriority.forEach((st, stIdx) => {
          const columnIndex = reactiveSchema.value
            .findIndex(column => column.key === st.key);
          reactiveSchema.value[columnIndex].sortPriority = stIdx + 1 + 1;
        });
      }
    }
  }

  function clearSort() {
    while (sortTasks.value.length > 0) {
      const sortTask = sortTasks.value.pop() as SortTask;
      const columnIndex = reactiveSchema.value
        .findIndex(column => column.key === sortTask.key);
      reactiveSchema.value[columnIndex].hasSort = 'NONE';
      reactiveSchema.value[columnIndex].sortPriority = undefined;
    }
  }

  const statsForColumnAtIndex = ref(-1);

  function pretty(n: number): string {
    return n
      .toFixed(3)
      .replace(/0+$/, '')
      .replace(/\.$/, '.0');
  }

  const stats = computed(() => {
    if (statsForColumnAtIndex.value < 0) {
      return {
        variable: '',
        data: [] as { param: string, value: string | number }[],
      };
    }

    const columnSchema = schema[statsForColumnAtIndex.value];
    const columnKey = columnSchema.key;
    const variable = columnSchema.name;
    let data;

    if (columnSchema.type === 'number') {
      const columnValues = rows.map(row => row[columnKey]) as number[];
      data = [
        { param: 'Число наблюдений', value: columnValues.length },
        { param: 'Минимум', value: pretty(min(columnValues)) },
        { param: '1-ый квартиль', value: pretty(quantile(columnValues, 0.25)) },
        { param: 'Медиана', value: pretty(median(columnValues)) },
        { param: '3-ий квартиль', value: pretty(quantile(columnValues, 0.75)) },
        { param: 'Максимум', value: pretty(max(columnValues)) },
        { param: 'Межкварт. интервал', value: pretty(iqr(columnValues)) },
        { param: 'Среднее', value: pretty(mean(columnValues)) },
        { param: 'Станд. отклонение', value: pretty(standardDeviation(columnValues)) },
      ];
    } else if (columnSchema.type === 'text') {
      const columnValues = rows.map(row => row[columnKey]) as string[];
      data = [
        { param: 'Число наблюдений', value: columnValues.length },
      ];
    } else if (columnSchema.type === 'factor') {
      const columnValues = rows.map(row => row[columnKey]) as string[];
      data = [
        { param: 'Число наблюдений', value: columnValues.length },
      ].concat(columnSchema.levels!.map(level => ({
        param: level,
        value: columnValues.filter(value => value === level).length,
      })));
    } else if (columnSchema.type === 'date') {
      const columnValues = rows.map(row => row[columnKey]) as Date[];
      data = [
        { param: 'Число наблюдений', value: columnValues.length },
        { param: 'Минимум', value: new Date(min(columnValues.map(d => d.getTime()))) },
        { param: 'Максимум', value: new Date(max(columnValues.map(d => d.getTime()))) },
      ];
    }

    return { variable, data };
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
