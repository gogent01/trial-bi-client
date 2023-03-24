<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li
      v-for="column in props.schema"
      :key="column.key"
      class="flex px-3 py-2 bg-white hover:bg-gray-50 cursor-pointer"
    >
      <div class="flex flex-1 gap-2 items-center justify-between">
        <div class="space-y-2 flex-1">
          <div :class="['flex gap-1 items-center text-gray-900']">
            <p class="text-sm">{{ column.name }}</p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { ReactiveTableSchemaInfo } from '@/data/types';

  interface Props {
    schema: ReactiveTableSchemaInfo;
  }

  const props = defineProps<Props>();
</script>
