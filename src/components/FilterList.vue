<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li v-for="(task, taskIdx) in props.tasks" :key="task.columnKey" class="flex p-3">
      <div class="flex flex-1 gap-2 items-center justify-between">
        <div class="space-y-2 flex-1">
          <div class="flex justify-between items-center">
            <p class="text-sm font-medium text-gray-900">{{ task.columnName }}</p>
            <p class="flex-shrink-0 text-xs text-gray-400 cursor-pointer hover:text-gray-600" @click="remove(taskIdx)">
              <span><trash-icon class="inline mr-1 h-4 w-4"></trash-icon>Удалить</span>
            </p>
          </div>
          <select
            :value="getOption(task.columnType, task.type)"
            class="block w-full rounded-md border-0 py-1 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 text-sm sm:leading-6"
            @change="updateFilterType($event, taskIdx)"
          >
            <option selected disabled>- выберите фильтр -</option>
            <option v-for="option in filterOptions[task.columnType]" :key="option.name">{{ option.name }}</option>
          </select>
          <div v-if="task.type === 'any'">
            <multiple-select
              :options="task.columnLevels || []"
              :selected="task.multipleValues"
              @change="updateFilterMultipleValues($event, taskIdx)"
            />
          </div>
          <div v-else-if="task.type === 'range'">
            <div v-if="task.columnType === 'number'" class="flex items-center gap-2">
              <label for="from" class="text-sm text-gray-900">от</label>
              <input
                type="text"
                :value="task.rangeValues[0] || ''"
                name="from"
                class="flex px-2 py-1 w-20 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="от"
                @input="sanitizeNumberInput"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
              <label for="to" class="text-sm text-gray-900">до</label>
              <input
                type="text"
                :value="task.rangeValues[1] || ''"
                name="to"
                class="flex px-2 py-1 w-20 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="до"
                @input="sanitizeNumberInput"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
            </div>
            <div v-else-if="task.columnType === 'date'" class="flex items-center gap-2">
              <label for="from" class="text-sm text-gray-900">от</label>
              <input
                :value="task.rangeValues[0] ? (task.rangeValues[0] as Date).toISOString().split('T')[0] : ''"
                :class="[
                  task.rangeValues[0] ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
              <label for="to" class="text-sm text-gray-900">до</label>
              <input
                :value="task.rangeValues[1] ? (task.rangeValues[1] as Date).toISOString().split('T')[0] : ''"
                :class="[
                  task.rangeValues[0] ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
            </div>
          </div>
          <template v-else-if="task.type">
            <template v-if="task.columnType === 'date'">
              <input
                :value="task.value ? (task.value as Date).toISOString().split('T')[0] : ''"
                :class="[
                  task.value ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="updateFilterValue($event, taskIdx)"
              />
            </template>
            <template v-else-if="task.columnType === 'number'">
              <input
                type="text"
                :value="task.value"
                class="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="введите значение"
                @input="sanitizeNumberInput"
                @keyup.enter="updateFilterValue($event, taskIdx)"
              />
            </template>
            <template v-else>
              <input
                type="text"
                :value="task.value"
                class="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="введите значение"
                @keyup.enter="updateFilterValue($event, taskIdx)"
              />
            </template>
          </template>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue';
  import type { ColumnType } from '../data/types';
  import type { FilterType, FilterTask } from '../classes/FilterTask';
  import { TrashIcon } from '@heroicons/vue/24/outline';
  import MultipleSelect from './MultipleSelect.vue';

  interface Props {
    tasks: FilterTask[];
  }

  const props = defineProps<Props>();

  const emit = defineEmits(['updateType', 'updateValue', 'updateRangeValues', 'updateMultipleValues', 'remove']);

  const filterOptions = {
    id: [],
    text: [
      { name: 'точное соответствие', value: 'eq' },
      { name: 'начинается с', value: 'sw' },
      { name: 'содержит', value: 'has' },
      { name: 'заканчивается на', value: 'ew' },
    ],
    number: [
      { name: 'равно', value: 'eq' },
      { name: 'больше', value: 'gt' },
      { name: 'больше или равно', value: 'gte' },
      { name: 'меньше', value: 'lt' },
      { name: 'меньше или равно', value: 'lte' },
      { name: 'диапазон', value: 'range' },
    ],
    date: [
      { name: 'равно', value: 'eq' },
      { name: 'больше', value: 'gt' },
      { name: 'больше или равно', value: 'gte' },
      { name: 'меньше', value: 'lt' },
      { name: 'меньше или равно', value: 'lte' },
      { name: 'диапазон', value: 'range' },
    ],
    factor: [
      { name: 'значение из списка', value: 'any' },
      { name: 'начинается с', value: 'sw' },
      { name: 'содержит', value: 'has' },
      { name: 'заканчивается на', value: 'ew' },
    ],
  };

  function getOption(columnType: ColumnType, filterType?: FilterType) {
    if (!filterType) return '- выберите фильтр -';
    const options = filterOptions[columnType].filter((option) => option.value === filterType);
    if (options.length > 0) return options[0].name;
    return '- выберите фильтр -';
  }

  function updateFilterType(event: Event, filterTaskIndex: number) {
    const target = event.target as HTMLSelectElement;
    const optionName = target.value;
    const columnType = props.tasks[filterTaskIndex].columnType;
    const filterType = filterOptions[columnType].filter((option) => option.name === optionName)[0].value;
    emit('updateType', filterTaskIndex, filterType);

    nextTick(() => (target.nextElementSibling as HTMLInputElement).focus());
  }

  function updateFilterValue(event: Event, filterTaskIndex: number) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    const columnType = props.tasks[filterTaskIndex].columnType;

    if (value.length === 0) return;

    let typedValue: string | number | Date;
    if (columnType === 'number') {
      typedValue = parseFloat(value);
      if (isNaN(typedValue)) return;
    } else if (columnType === 'date') {
      typedValue = new Date(value);
    } else {
      typedValue = value as string;
    }

    emit('updateValue', filterTaskIndex, typedValue);
    target.blur();
  }

  function updateFilterRangeValues(event: Event, filterTaskIndex: number) {
    const columnType = props.tasks[filterTaskIndex].columnType;
    const parentNode = (event.target as HTMLInputElement).parentNode as HTMLDivElement;
    const inputFrom = parentNode.childNodes[1] as HTMLInputElement;
    const inputTo = parentNode.childNodes[3] as HTMLInputElement;

    let typedFromValue: number | Date | undefined;
    let typedToValue: number | Date | undefined;
    if (columnType === 'number') {
      typedFromValue = inputFrom.value !== '' ? parseFloat(inputFrom.value) : undefined;
      typedToValue = inputTo.value !== '' ? parseFloat(inputTo.value) : undefined;
    } else if (columnType === 'date') {
      typedFromValue = inputFrom.value !== '' ? new Date(inputFrom.value) : undefined;
      typedToValue = inputTo.value !== '' ? new Date(inputTo.value) : undefined;
    }

    emit('updateRangeValues', filterTaskIndex, [typedFromValue, typedToValue]);
  }

  function updateFilterMultipleValues(values: string[], filterTaskIndex: number) {
    emit('updateMultipleValues', filterTaskIndex, values);
  }

  function remove(filterTaskIndex: number) {
    emit('remove', filterTaskIndex);
  }

  function sanitizeNumberInput(event: Event) {
    const input = event.target! as HTMLInputElement;

    let i = 0;
    input.value = input.value
      .replace(',', '.')
      .replace(/[^0-9.-]/g, '')
      .replace(/(.)-/g, '$1')
      .replace(/\./g, function (match) {
        return match === '.' ? (i++ === 0 ? '.' : '') : '';
      })
      .replace(/^\./g, '');
  }
</script>
