<template>
  <div class="inline-block min-w-full align-middle border-4">
    <table class="table-fixed border-separate border-spacing-0">
      <thead>
        <tr>
          <th
            :class="[ncol > 0 ? 'border-r' : '']"
            class="sticky top-0 border-b border-gray-200 bg-white bg-opacity-75 px-3 py-3 backdrop-blur backdrop-filter cursor-pointer"
          >
            <p class="text-left text-sm font-semibold text-gray-900">#</p>
          </th>
          <th
            v-for="(column, columnIdx) in visibleSchema"
            :key="column.key"
            :class="[
              columnIdx < ncol - 1 ? 'border-r border-gray-200' : '',
              'sticky top-0 whitespace-pre-wrap border-b border-gray-200 bg-white bg-opacity-75 backdrop-blur backdrop-filter cursor-pointer select-none',
            ]"
            style="min-width: 2rem; max-width: 12rem"
            scope="col"
          >
            <div class="flex">
              <p class="flex-1 pl-3 py-3 text-left text-sm font-semibold text-gray-900" @click="emitSort(column.key)">
                <span v-if="column.hasSort === 'ASC'" class="mr-1">
                  <span class="text-xs text-gray-400">{{ column.sortPriority }}</span>
                  <chevron-down-icon class="inline h-4 w-4" />
                </span>
                <span v-if="column.hasSort === 'DESC'" class="mr-1">
                  <span class="text-xs text-gray-400">{{ column.sortPriority }}</span>
                  <chevron-up-icon class="inline h-4 w-4" />
                </span>
                <span class="inline whitespace-pre-wrap">{{ column.name }}</span>
              </p>
              <div class="p-3 flex gap-1 items-center">
                <span @click="emitFilter(column.key)">
                  <funnel-icon v-if="!column.hasFilter" class="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  <funnel-icon-active v-else class="h-4 w-4 text-gray-600 hover:text-gray-800" />
                </span>
                <span @click="emitStats(column.key)">
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
              'px-3 py-1 text-sm text-gray-600 whitespace-pre-wrap border-r border-gray-200',
            ]"
            style="min-width: 2rem; max-width: 20rem"
          >
            {{ (currentPage - 1) * limit + (rowIdx + 1) }}
          </td>
          <td
            v-for="(column, columnIdx) in visibleSchema"
            :key="column.key"
            :class="[
              rowIdx < nrow - 1 ? 'border-b border-gray-200' : '',
              columnIdx < ncol - 1 ? 'border-r border-gray-200' : '',
              'px-3 py-1 text-sm text-gray-600 whitespace-pre-wrap',
            ]"
            style="min-width: 2rem; max-width: 12rem"
          >
            {{
              row[column.key] instanceof Date
                ? (row[column.key]! as Date).toLocaleDateString(CURRENT_LOCALE)
                : row[column.key]
            }}
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="hover:bg-slate-50">
          <td
            :colspan="visibleSchema.length + 1"
            :class="[ncol > 0 ? 'border-r border-gray-200' : '']"
            class="px-3 py-1 text-sm text-gray-600 text-center whitespace-nowrap"
          >
            {{ t('query_result.no_data') }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { FunnelIcon, ChartBarIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline';
  import { FunnelIcon as FunnelIconActive, ChartBarIcon as ChartBarIconActive } from '@heroicons/vue/24/solid';
  import type { ReactiveTableSchema, TableData } from '../data/types';
  import { CURRENT_LOCALE } from '../config/variables';

  const { t } = useI18n();

  interface Props {
    table: TableData;
    reactiveSchema: ReactiveTableSchema;
    currentPage: number;
    limit: number;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'filter', columnKey: string): void;
    (e: 'sort', columnKey: string): void;
    (e: 'stats', columnKey: string): void;
  }
  const emit = defineEmits<Emits>();

  const ncol = computed(() => (props.table.length > 0 ? Object.keys(props.table[0]).length : 0));
  const nrow = computed(() => props.table.length);

  const visibleSchema = computed(() => {
    return props.reactiveSchema.filter((column) => !column.invisible);
  });

  function emitFilter(columnKey: string) {
    emit('filter', columnKey);
  }

  function emitSort(columnKey: string) {
    emit('sort', columnKey);
  }

  function emitStats(columnKey: string) {
    emit('stats', columnKey);
  }
</script>
