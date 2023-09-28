<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li
      v-for="column in props.schema"
      :key="column.key"
      class="flex px-3 py-2 bg-white hover:bg-gray-50 cursor-pointer"
      @click="emitToggleColumnVisibility(column.key)"
    >
      <div class="flex flex-1 gap-2 items-center justify-between">
        <div class="space-y-2 flex-1">
          <div :class="[column.invisible ? 'text-gray-400' : 'text-gray-900', 'flex gap-1 items-center']">
            <p class="flex-shrink-0 text-xs cursor-pointer text-gray-400">
              <span v-if="column.invisible">
                <eye-slash-icon class="inline mr-1 h-4 w-4"></eye-slash-icon>
              </span>
              <span v-else>
                <check-icon class="text-teal-600 inline mr-1 h-4 w-4"></check-icon>
              </span>
            </p>
            <p class="text-xs">{{ column.name }}</p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { ReactiveTableSchema } from '../data/types';
  import { CheckIcon, EyeSlashIcon } from '@heroicons/vue/24/outline';

  interface Props {
    schema: ReactiveTableSchema;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'toggleColumnVisibility', columnKey: string): void;
  }
  const emit = defineEmits<Emits>();

  function emitToggleColumnVisibility(columnKey: string) {
    emit('toggleColumnVisibility', columnKey);
  }
</script>
