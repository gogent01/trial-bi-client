<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between h-16 p-3">
        <div class="flex items-center gap-1 h-full text-slate-600"></div>
        <div class="flex items-center gap-4 h-full">
          <div class="flex-shrink-0 h-full">
            <button type="button"
                    :class="[false ? 'hover:bg-gray-50' : 'opacity-50']"
                    class="relative inline-flex items-center h-full rounded-md bg-white px-4 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-inset ring-gray-300">
              <trash-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Удалить все</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { TrashIcon } from '@heroicons/vue/24/outline';
</script>
