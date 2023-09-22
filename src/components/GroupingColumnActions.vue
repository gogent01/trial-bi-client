<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li
      v-for="column in schema.filter((c) => c.grouping.action !== 'group')"
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
            t('grouping.enter_value')
          "
          @input="updateGroupingParam($event, column)"
        />
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type {
    ColumnType,
    GroupingAction,
    GroupingMixin,
    GroupingReactiveTableColumn,
    GroupingReactiveTableSchema,
    SelectOption,
  } from '../data/types';
  import SingleSelect from './SingleSelect.vue';

  const { t } = useI18n();

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
      text: t('grouping.actions.long.hide'),
      value: 'hide',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: t('grouping.actions.long.count'),
      value: 'count',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: t('grouping.actions.long.mean'),
      value: 'mean',
      applicability: ['number'],
    },
    {
      text: t('grouping.actions.long.median'),
      value: 'median',
      applicability: ['number'],
    },
    {
      text: t('grouping.actions.long.sum'),
      value: 'sum',
      applicability: ['number'],
    },
    {
      text: t('grouping.actions.long.first'),
      value: 'first',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: t('grouping.actions.long.last'),
      value: 'last',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
    },
    {
      text: t('grouping.actions.long.nth'),
      value: 'nth',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: t('grouping.actions.placeholders.index_number'),
    },
    {
      text: t('grouping.actions.long.unique'),
      value: 'unique',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: t('grouping.actions.placeholders.separator'),
    },
    {
      text: t('grouping.actions.long.all'),
      value: 'all',
      applicability: ['id', 'text', 'factor', 'number', 'date'],
      paramPlaceholder: t('grouping.actions.placeholders.separator'),
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
