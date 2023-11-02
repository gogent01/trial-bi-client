<template>
  <div>
    <p class="font-semibold whitespace-pre-wrap text-sm text-gray-900 lg:text-base">{{ variable }}</p>
    <div class="mt-2 w-full align-middle rounded-lg border border-gray-300 overflow-hidden">
      <table class="table w-full border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              v-for="(colname, colnameIdx) in Object.values(colnames)"
              :key="colname"
              scope="col"
              :class="[
                colnameIdx < ncol - 1 ? 'border-r border-gray-300' : '',
                'border-b border-gray-300 px-2 py-2 text-left text-xs font-semibold whitespace-pre-wrap text-gray-900 lg:px-3 lg:text-sm',
              ]"
            >
              {{ colname }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(dataRow, dataIdx) in data" :key="dataRow.param" class="hover:bg-slate-50">
            <td
              v-for="(colname, colnameIdx) in Object.keys(colnames)"
              :key="colname"
              :class="[
                dataIdx < nrow - 1 ? 'border-b border-gray-300' : '',
                colnameIdx < ncol - 1 ? 'border-r border-gray-300' : '',
                'px-2 py-1 text-xs text-gray-600 whitespace-pre-wrap lg:px-3 lg:text-sm',
              ]"
              style="min-width: 2rem"
            >
              {{ dataRow[colname as 'param' | 'value'] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { StatsRow } from '../classes/ColumnStats';

  const { t } = useI18n();

  const colnames = {
    param: t('stats.param'),
    value: t('stats.value'),
  };

  interface Props {
    variable: string;
    data: StatsRow[];
  }
  const props = defineProps<Props>();

  const ncol = Object.keys(colnames).length;
  const nrow = computed(() => props.data?.length || 0);
</script>
