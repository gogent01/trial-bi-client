<template>
  <div class="w-full space-y-8">
    <div v-for="group in groupedSchema" :key="group.origin.key" class="bg-white">
      <p class="rounded-xl bg-slate-200 px-2 py-0.5 text-lg font-semibold text-gray-900">{{ group.origin.name }}</p>
      <ul role="list" class="mt-2 w-full columns-3">
        <li
          v-for="column in group.columns"
          :key="column.key"
          class="flex p-2 bg-white hover:bg-gray-50 cursor-pointer"
          @click.self="emitChange({ originKey: group.origin.key, columnKey: column.key })"
        >
          <div class="flex flex-1 gap-2 items-center justify-between">
            <div class="space-y-2 flex-1">
              <div
                :class="['flex gap-2 items-center']"
                @click.self="emitChange({ originKey: group.origin.key, columnKey: column.key })"
              >
                <input
                  type="checkbox"
                  :id="group.origin.key + column.key"
                  :name="group.origin.key + column.key"
                  :checked="column.selected"
                  class="h-4 w-4 rounded border-gray-300 text-teal-600 cursor-pointer focus:ring-teal-600"
                  @change="emitChange({ originKey: group.origin.key, columnKey: column.key })"
                />
                <label :for="group.origin.key + column.key" class="text-sm text-gray-900 cursor-pointer select-none">{{
                  column.name
                }}</label>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import type { ReactiveTableColumnInfo, ReactiveTableSchemaInfo } from '@/data/types';

  interface Props {
    schema: ReactiveTableSchemaInfo;
  }
  const props = defineProps<Props>();
  const emit = defineEmits(['change']);

  type SchemaGroup = {
    origin: {
      key: string;
      name: string;
    };
    columns: ReactiveTableSchemaInfo;
  };

  type GroupedSchema = SchemaGroup[];

  const groupedSchema = computed<GroupedSchema>(() => {
    const includedOrigins: Set<string> = new Set();
    return props.schema
      .sort((columnA, columnB) => columnA.origin.name.localeCompare(columnB.origin.name))
      .reduce((groupedSchema: GroupedSchema, column: ReactiveTableColumnInfo) => {
        if (!includedOrigins.has(column.origin.key)) {
          includedOrigins.add(column.origin.key);
          groupedSchema.push({ origin: column.origin, columns: [] });
        }
        groupedSchema[groupedSchema.length - 1].columns.push(column);
        return groupedSchema;
      }, []);
  });

  function emitChange(at: { originKey: string; columnKey: string }) {
    emit('change', at);
  }
</script>
