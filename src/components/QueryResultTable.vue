<template>
  <div class="inline-block min-w-full align-middle border-4">
    <table class="table-fixed border-separate border-spacing-0">
      <thead>
        <tr>
          <th
            class="sticky top-0 border-r border-b border-gray-200 bg-white bg-opacity-75 px-3 py-3 backdrop-blur backdrop-filter cursor-pointer"
          >
            <p class="text-left text-sm font-semibold text-gray-900">#</p>
          </th>
          <th
            v-for="(column, columnIdx) in reactiveSchema"
            :key="column.key"
            scope="col"
            :class="[
              columnIdx < ncol - 1 ? 'border-r border-gray-200' : '',
              'sticky top-0 border-b border-gray-200 bg-white bg-opacity-75 backdrop-blur backdrop-filter cursor-pointer select-none',
            ]"
          >
            <div class="flex">
              <p class="flex-1 pl-3 py-3 text-left text-sm font-semibold text-gray-900" @click="emitSort(columnIdx)">
                <span v-if="column.hasSort === 'ASC'" class="mr-1">
                  <span class="text-xs text-gray-400">{{ column.sortPriority }}</span>
                  <chevron-down-icon class="inline h-4 w-4" />
                </span>
                <span v-if="column.hasSort === 'DESC'" class="mr-1">
                  <span class="text-xs text-gray-400">{{ column.sortPriority }}</span>
                  <chevron-up-icon class="inline h-4 w-4" />
                </span>
                <span class="inline">{{ column.name }}</span>
              </p>
              <div class="p-3 flex gap-1 items-center">
                <span @click="emitFilter(columnIdx)">
                  <funnel-icon v-if="!column.hasFilter" class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  <funnel-icon-active v-else class="h-4 w-4 text-gray-600 hover:text-gray-800" />
                </span>
                <span @click="emitStats(columnIdx)">
                  <chart-bar-icon v-if="!column.hasStats" class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  <chart-bar-icon-active v-else class="h-4 w-4 text-gray-600 hover:text-gray-800" />
                </span>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="table.length > 0">
        <tr v-for="(row, rowIdx) in table" :key="rowIdx" class="hover:bg-slate-50">
          <td
            :class="[
              rowIdx < nrow - 1 ? 'border-b border-gray-200' : '',
              'px-3 py-1 text-sm text-gray-500 whitespace-nowrap border-r border-gray-200',
            ]"
            style="min-width: 2rem"
          >
            {{ (currentPage - 1) * limit + (rowIdx + 1) }}
          </td>
          <td
            v-for="(cell, cellIdx) in Object.keys(row)"
            :key="cell"
            :class="[
              rowIdx < nrow - 1 ? 'border-b border-gray-200' : '',
              cellIdx < ncol - 1 ? 'border-r border-gray-200' : '',
              'px-3 py-1 text-sm text-gray-500 whitespace-nowrap',
            ]"
            style="min-width: 2rem"
          >
            {{ row[cell] instanceof Date ? row[cell].toLocaleDateString('ru') : row[cell] }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="hover:bg-slate-50">
          <td :colspan="reactiveSchema.length" class="px-3 py-1 text-sm text-gray-500 text-center whitespace-nowrap">
            Нет данных для отображения
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { FunnelIcon, ChartBarIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
  import { FunnelIcon as FunnelIconActive, ChartBarIcon as ChartBarIconActive } from '@heroicons/vue/24/solid';
  import { ReactiveSchema, FakeQueryTable } from '@/data/fake';

  interface Props {
    table: FakeQueryTable;
    reactiveSchema: ReactiveSchema;
    currentPage: number;
    limit: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['sort', 'filter', 'stats']);

  const ncol = Object.keys(props.table[0]).length;
  const nrow = props.table.length;

  function emitFilter(columnIdx: number) {
    emit('filter', columnIdx);
  }

  function emitSort(columnIdx: number) {
    emit('sort', columnIdx);
  }

  function emitStats(columnIdx: number) {
    emit('stats', columnIdx);
  }
</script>
