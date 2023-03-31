<template>
  <div>
    <p class="font-semibold whitespace-pre-wrap text-gray-900">{{ variable }}</p>
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
                'border-b border-gray-300 px-3 py-2 text-left text-sm font-semibold whitespace-pre-wrap text-gray-900',
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
                'px-3 py-1 text-sm text-gray-600 whitespace-pre-wrap',
              ]"
              style="min-width: 2rem"
            >
              {{ dataRow[colname] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { StatsRow } from '@/classes/ColumnStats';

  const colnames = {
    param: 'Параметр',
    value: 'Значение',
  };

  interface Props {
    variable: string;
    data: StatsRow[];
  }

  const props = defineProps<Props>();

  const ncol = Object.keys(colnames).length;
  const nrow = computed(() => props.data?.length || 0);
</script>
