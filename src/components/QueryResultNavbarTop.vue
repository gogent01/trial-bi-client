<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full">
          <p class="text-slate-700">По запросу было найдено {{ toLocaleRowCount(nrow) }}</p>
        </div>
        <div class="flex items-center gap-2 h-full">
          <div v-if="isSortActive" class="flex-shrink-0 h-full">
            <button
              type="button"
              class="relative inline-flex items-center h-full rounded-md bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              @click="isSortActive && emit('clearSort')"
            >
              <x-mark-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
              <span>Сбросить сортировку</span>
            </button>
          </div>

          <div class="flex-shrink-0 h-full">
            <button
              type="button"
              class="relative inline-flex items-center rounded-md border border-transparent bg-teal-600 h-full px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              <arrow-down-tray-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/vue/20/solid';

  interface Props {
    nrow: number;
    isSortActive: boolean;
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['clearSort']);

  function toLocaleRowCount(n: number) {
    const cases = { sin: { nom: 'запись', gen: 'записи' }, plu: { nom: 'записи', gen: 'записей' } };
    const correctCase =
      n % 10 === 1 && n % 100 !== 11
        ? cases.sin.nom
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? cases.sin.gen
        : cases.plu.gen;
    return `${n} ${correctCase}`;
  }
</script>
