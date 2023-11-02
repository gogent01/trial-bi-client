<template>
  <div class="w-full space-y-8">
    <div v-for="group in groupedSchema" :key="group.origin.key" class="bg-white">
      <div class="w-full flex px-2 py-1 items-center justify-between rounded-xl bg-slate-200 lg:py-0.5">
        <p class="text-base font-semibold text-gray-900 lg:text-lg">{{ group.origin.name }}</p>
        <button
          v-if="group.columns.every((column) => column.selected)"
          class="mr-2 text-xs text-gray-700 cursor-pointer hover:text-gray-800"
          @click="deselectAll(group.origin.key)"
        >
          {{ t('query.remove_all') }}
        </button>
        <button
          v-else
          class="mr-2 text-xs text-gray-600 cursor-pointer hover:text-gray-800"
          @click="selectAll(group.origin.key)"
        >
          {{ t('query.select_all') }}
        </button>
      </div>
      <ul role="list" class="mt-2 w-full columns-2 xl:columns-3">
        <li
          v-for="column in group.columns"
          :key="column.key"
          class="flex p-2 bg-white rounded-md hover:bg-gray-50 cursor-pointer"
          @click.self="emitChange({ originKey: group.origin.key, columnKey: column.key })"
        >
          <div class="flex flex-1 gap-2 items-center justify-between">
            <div class="space-y-2 flex-1">
              <div :class="['flex gap-2 items-center']">
                <input
                  type="checkbox"
                  :id="group.origin.key + column.key"
                  :name="group.origin.key + column.key"
                  :checked="column.selected"
                  class="h-4 w-4 rounded border-gray-300 text-teal-600 cursor-pointer focus:ring-teal-600"
                  @change="emitChange({ originKey: group.origin.key, columnKey: column.key })"
                />
                <label
                  :for="group.origin.key + column.key"
                  class="w-full text-sm text-gray-900 cursor-pointer select-none"
                  >{{ column.name }}</label
                >
              </div>
            </div>
          </div>
        </li>
        <li
          v-for="placeholder in Array.from({
            length: group.columns.length % 3 === 0 ? 0 : 3 - group.columns.length,
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
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import type { ReactiveTableColumnInfo, ReactiveTableSchemaInfo } from '../data/types';

  const { t } = useI18n();

  interface Props {
    schema: ReactiveTableSchemaInfo;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'change', at: { originKey: string; columnKey: string }): void;
  }
  const emit = defineEmits<Emits>();

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
      .sort(
        (columnA, columnB) =>
          columnA.origin.priority - columnB.origin.priority ||
          columnA.origin.name.localeCompare(columnB.origin.name) ||
          columnA.position - columnB.position
      )
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

  function selectAll(originKey: string) {
    const schema = groupedSchema.value.find((schema) => schema.origin.key === originKey);
    const columnKeys = schema!.columns.filter((column) => !column.selected).map((column) => column.key);
    columnKeys.forEach((columnKey) => emitChange({ originKey, columnKey }));
  }

  function deselectAll(originKey: string) {
    const schema = groupedSchema.value.find((schema) => schema.origin.key === originKey);
    const columnKeys = schema!.columns.filter((column) => column.selected).map((column) => column.key);
    columnKeys.forEach((columnKey) => emitChange({ originKey, columnKey }));
  }
</script>
