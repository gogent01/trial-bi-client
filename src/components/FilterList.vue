<template>
  <ul role="list" class="w-full divide-y divide-gray-200">
    <li v-for="(task, taskIdx) in props.tasks" :key="task.columnKey" class="flex p-3">
      <div class="flex flex-1 gap-2 items-center justify-between">
        <div class="space-y-2 flex-1">
          <p class="text-sm font-medium text-gray-900">{{ task.columnName }}</p>
          <select
            :value="getOption(task.columnType, task.type)"
            class="block w-full rounded-md border-0 py-1 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 text-sm sm:leading-6"
            @change="updateFilterType($event, taskIdx)"
          >
            <option selected disabled>- выберите фильтр -</option>
            <option v-for="option in filterOptions[task.columnType]" :key="option.name">{{ option.name }}</option>
          </select>
          <div v-if="task.type === 'range'">
            <div v-if="task.columnType === 'number'" class="flex items-center gap-2">
              <label for="from" class="text-sm text-gray-900">от</label>
              <input
                :type="task.columnType"
                :value="task.rangeValues[0] || ''"
                name="from"
                class="flex px-2 py-1 w-20 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="от"
                @keyup.enter="updateFilterRangeValues($event, taskIdx)"
              />
              <label for="to" class="text-sm text-gray-900">до</label>
              <input
                :type="task.columnType"
                :value="task.rangeValues[1] || ''"
                name="to"
                class="flex px-2 py-1 w-20 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="до"
                @keyup.enter="updateFilterRangeValues($event, taskIdx)"
              />
            </div>
            <div v-else-if="task.columnType === 'date'" class="flex items-center gap-2">
              <label for="from" class="text-sm text-gray-900">от</label>
              <input
                :value="task.rangeValues[0] ? task.rangeValues[0].toISOString().split('T')[0] : ''"
                :class="[
                  task.rangeValues[0] ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="$event.target.blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
              <label for="to" class="text-sm text-gray-900">до</label>
              <input
                :value="task.rangeValues[1] ? task.rangeValues[1].toISOString().split('T')[0] : ''"
                :class="[
                  task.rangeValues[0] ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="$event.target.blur()"
                @blur="updateFilterRangeValues($event, taskIdx)"
              />
            </div>
          </div>
          <template v-else-if="task.type">
            <template v-if="task.columnType === 'date'">
              <input
                :value="task.value ? task.value.toISOString().split('T')[0] : ''"
                :class="[
                  task.value ? 'text-gray-900' : 'placeholder:text-gray-400',
                  'flex p-1 rounded-md border-0  shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
                ]"
                type="date"
                @keyup.enter="updateFilterValue($event, taskIdx)"
              />
            </template>
            <template v-else>
              <input
                :type="task.columnType === 'factor' ? 'text' : task.columnType"
                :value="task.value"
                class="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="введите значение"
                @keyup.enter="updateFilterValue($event, taskIdx)"
              />
            </template>
          </template>
        </div>
        <x-mark-icon
          class="-mr-1 h-5 w-5 text-gray-400 hover:text-gray-600 cursor-pointer"
          @click="remove(taskIdx)"
        ></x-mark-icon>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { nextTick } from 'vue';
  import { XMarkIcon } from '@heroicons/vue/20/solid';

  type ColumnType = 'text' | 'number' | 'date' | 'factor';
  type FilterType = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'sw' | 'has' | 'ew' | 'range' | 'any';
  type FilterTask = {
    columnKey: string;
    columnName: string;
    columnType: ColumnType;
    type?: FilterType;
    value?: string | number | Date;
  };

  interface Props {
    tasks: FilterTask[];
  }
  const props = defineProps<Props>();

  const emit = defineEmits(['updateType', 'updateValue', 'updateRangeValues', 'remove']);

  const filterOptions = {
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
      { name: 'любое значение из списка', value: 'any' },
      { name: 'начинается с', value: 'sw' },
      { name: 'содержит', value: 'has' },
      { name: 'заканчивается на', value: 'ew' },
    ],
  };

  function getOption(columnType: ColumnType, filterType: FilterType) {
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

    let typedValue: string | number | Date;
    if (columnType === 'number') {
      typedValue = parseFloat(value);
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

  function remove(filterTaskIndex: number) {
    emit('remove', filterTaskIndex);
  }
</script>
