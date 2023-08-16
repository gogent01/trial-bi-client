<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between h-16 p-3">
        <div class="flex items-center gap-2 h-full">
          <div v-if="isFilterActive" class="flex-shrink-0 h-full">
            <button
              :class="[isFilterActive ? 'hover:bg-gray-50' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center h-full rounded-md bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300"
              @click="isFilterActive && emit('clearFilters')"
            >
              <trash-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
              <span>Удалить все</span>
            </button>
          </div>
        </div>
        <div class="flex items-center gap-2 h-full">
          <!--          <div class="flex-shrink-0 h-full">-->
          <!--            <button-->
          <!--              :class="[isFilterActive ? 'hover:bg-teal-700' : 'opacity-50']"-->
          <!--              class="relative inline-flex items-center rounded-md border border-transparent bg-teal-600 h-full px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"-->
          <!--            >-->
          <!--              <funnel-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />-->
          <!--              <span>Применить</span>-->
          <!--            </button>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { TrashIcon } from '@heroicons/vue/24/outline';

  interface Props {
    isFilterActive: boolean;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'clearFilters'): void;
  }
  const emit = defineEmits<Emits>();
</script>
