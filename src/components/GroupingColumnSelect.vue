<template>
  <div class="w-full space-y-8">
    <ul role="list" class="w-full columns-2 xl:columns-3">
      <li
        v-for="(column, columnIdx) in schema"
        :key="column.origin.key + column.key"
        class="flex p-2 bg-white hover:bg-gray-50 cursor-pointer"
      >
        <div class="flex flex-1 gap-2 items-center justify-between">
          <div class="space-y-2 flex-1">
            <div :class="['flex gap-2 items-center']">
              <input
                type="checkbox"
                :id="column.origin.key + column.key"
                :name="column.origin.key + column.key"
                :checked="column.grouping.action === 'group'"
                class="h-4 w-4 rounded border-gray-300 text-teal-600 cursor-pointer focus:ring-teal-600"
                @change="emitChange(column.origin.key, column.key)"
              />
              <label :for="column.origin.key + column.key" class="text-sm text-gray-900 cursor-pointer select-none">{{
                column.name
              }}</label>
            </div>
          </div>
        </div>
      </li>
      <li
        v-for="placeholder in Array.from({
          length: schema.length % 3 === 0 ? 0 : 3 - schema.length,
        }).fill(0)"
        :key="placeholder as number"
        class="invisible flex p-2 bg-white hover:bg-gray-50 cursor-pointer"
      >
        <div class="flex flex-1 gap-2 items-center justify-between">
          <div class="space-y-2 flex-1">
            <div class="flex gap-2 items-center">
              <input
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-teal-600 cursor-pointer focus:ring-teal-600"
              />
              <label class="text-sm text-gray-900 cursor-pointer select-none">{{ placeholder }}</label>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { GroupingReactiveTableSchema } from '../data/types';

  interface Props {
    schema: GroupingReactiveTableSchema;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'change', originKey: string, columnKey: string): void;
  }
  const emit = defineEmits<Emits>();

  function emitChange(originKey: string, columnKey: string) {
    emit('change', originKey, columnKey);
  }
</script>
