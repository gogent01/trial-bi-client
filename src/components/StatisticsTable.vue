<template>
  <div class="inline-block w-full align-middle rounded-lg border border-gray-300">
    <table class="table w-full border-separate border-spacing-0">
      <thead>
      <tr>
        <th v-for="(colname, colnameIdx) in Object.values(colnames)" :key="colname" scope="col"
            :class="[colnameIdx < ncol - 1 ? 'border-r border-gray-300' : '', 'border-b border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-900']">{{ colname }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(dataRow, dataIdx) in data" :key="dataRow.param" class="hover:bg-slate-50">
        <td v-for="(colname, colnameIdx) in Object.keys(colnames)" :key="colname" :class="[dataIdx < nrow - 1 ? 'border-b border-gray-300' : '', colnameIdx < ncol - 1 ? 'border-r border-gray-300' : '', 'px-3 py-1 text-sm text-gray-600 whitespace-nowrap']" style="min-width: 2rem;">{{ dataRow[colname] }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const colnames = {
  param: 'Параметр',
  value: 'Значение',
};

interface Props {
  data: { param: string, value: string | number }[];
}

const props = defineProps<Props>();

const ncol = Object.keys(colnames).length;
const nrow = computed(() => props.data?.length || 0);
</script>
