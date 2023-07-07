<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li
      v-for="column in schema.filter((column) => column.grouping.action !== 'group')"
      :key="column.origin.key + column.key"
      class="w-full flex gap-2 items-center p-2 bg-white"
    >
      <p class="w-1/4 text-sm text-gray-900">{{ column.name }}</p>
      <single-select
        :options="groupingActionOptions.filter((option) => option.applicability.includes(column.type))"
        :selected="groupingActionOptions.find((option) => option.value === column.grouping.action)"
        class="w-64"
        @change="updateGroupingAction($event, column)"
      />
      <div v-if="['nth', 'all', 'unique'].includes(column.grouping.action)" class="flex items-center gap-2">
        <input
          type="text"
          :value="''"
          class="block w-40 rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
          :placeholder="
            groupingActionOptions.find((option) => option.value === column.grouping.action)?.paramPlaceholder ||
            'введите значение'
          "
          @input="updateGroupingParam($event, column)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type {
    ColumnType,
    GroupingAction,
    GroupingMixin,
    GroupingReactiveTableColumn,
    GroupingReactiveTableSchema,
    SelectOption,
  } from '../data/types';
  import SingleSelect from './SingleSelect.vue';

  interface Props {
    schema: GroupingReactiveTableSchema;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'change', originKey: string, columnKey: string, groupingAction: GroupingMixin): void;
  }
  const emit = defineEmits<Emits>();

  type GroupingActionOption = {
    text: string;
    value: string;
    applicability: ColumnType[];
    paramPlaceholder?: string;
    disabled?: boolean;
  };

  const groupingActionOptions: GroupingActionOption[] = [
    {
      text: 'скрыть',
      value: 'hide',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: 'количество значений',
      value: 'count',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: 'первое значение',
      value: 'first',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: 'последнее значение',
      value: 'last',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: 'значение по счету',
      value: 'nth',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: 'порядковый номер',
    },
    {
      text: 'все значения',
      value: 'all',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: 'разделитель',
    },
    {
      text: 'все уникальные значения',
      value: 'unique',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: 'разделитель',
    },
    {
      text: 'сумма',
      value: 'sum',
      applicability: ['number'],
    },
    {
      text: 'среднее',
      value: 'mean',
      applicability: ['number'],
    },
    {
      text: 'медиана',
      value: 'median',
      applicability: ['number'],
    },
  ];

  function updateGroupingAction(groupingActionOption: SelectOption, column: GroupingReactiveTableColumn): void {
    emitChange(
      { grouping: { action: groupingActionOption.value as GroupingAction, param: column.grouping.param } },
      column.origin.key,
      column.key
    );
  }

  function updateGroupingParam(e: Event, column: GroupingReactiveTableColumn): void {
    emitChange(
      { grouping: { action: column.grouping.action, param: (e.target as HTMLInputElement).value } },
      column.origin.key,
      column.key
    );
  }

  function emitChange(groupingMixin: GroupingMixin, originKey: string, columnKey: string) {
    emit('change', originKey, columnKey, groupingMixin);
  }
</script>
