<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between gap-3 h-16 py-3 px-4">
        <div class="flex items-center h-full">
          <p v-if="ncol > 0" class="text-xs text-slate-700 lg:text-sm">{{ toLocaleRowCount(nrow) }}</p>
        </div>
        <div class="flex items-center gap-2 h-full">
          <div v-if="isSortActive" class="flex-shrink-0 h-full">
            <button
              type="button"
              :class="[isSortActive ? 'hover:bg-gray-50' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center h-full rounded-md bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300"
              @click="isSortActive && emit('clearSort')"
            >
              <trash-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
              <span>{{ t('sorting.clear') }}</span>
            </button>
          </div>

          <div class="flex-shrink-0 h-full">
            <button
              type="button"
              :class="[ncol > 0 && nrow > 0 ? 'hover:bg-teal-700' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center rounded-md border border-transparent bg-teal-600 h-full px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              @click="ncol > 0 && nrow > 0 && emit('save')"
            >
              <arrow-down-tray-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>{{ t('query_result.export') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { ArrowDownTrayIcon } from '@heroicons/vue/20/solid';
  import { TrashIcon } from '@heroicons/vue/24/outline';

  const { t } = useI18n();

  interface Props {
    ncol: number;
    nrow: number;
    isSortActive: boolean;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'clearSort'): void;
    (e: 'save'): void;
  }
  const emit = defineEmits<Emits>();

  function toLocaleRowCount(n: number) {
    const foundCases = {
      sin: { nom: 'была найдена', gen: 'было найдено' },
      plu: { nom: 'были найдены', gen: 'было найдено' },
    };
    const recordCases = { sin: { nom: 'запись', gen: 'записи' }, plu: { nom: 'записи', gen: 'записей' } };
    const cases: ['sin' | 'plu', 'nom' | 'gen'] =
      n % 10 === 1 && n % 100 !== 11
        ? ['sin', 'nom']
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? ['sin', 'gen']
        : ['plu', 'gen'];
    return t('query_result.records_found', { n });
  }
</script>
