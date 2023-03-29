<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between h-16 p-3">
        <div class="flex items-center gap-1 h-full text-slate-600"></div>
        <div class="flex items-center gap-4 h-full">
          <div class="flex-shrink-0 h-full">
            <button
              type="button"
              :class="[isQueryActive ? 'hover:bg-teal-700' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center rounded-md border border-transparent bg-teal-600 h-full px-4 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              @click="isQueryActive && emit('editQuery')"
            >
              <pencil-square-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Редактировать</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { PencilSquareIcon } from '@heroicons/vue/24/outline';

  interface Props {
    isQueryActive: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['editQuery']);
</script>
