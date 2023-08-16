<template>
  <TransitionRoot as="template" :show="isVisible">
    <Dialog :initialFocus="buttonCancel as unknown as HTMLElement" as="div" class="relative z-10" @close="cancel">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-12 text-center sm:items-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative w-full flex flex-col p-6 transform overflow-hidden rounded-lg bg-slate-300 text-left shadow-xl transition-all xl:w-4/5"
              style="height: 80vh"
            >
              <div class="h-full flex-grow-0 flex flex-col gap-6">
                <div class="basis-1/3 flex flex-col overflow-hidden">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-900">
                    <p class="text-xl font-semibold">Выберите, по каким столбцам сгруппировать данные:</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-auto">
                    <div class="w-full p-4 relative flex justify-center">
                      <grouping-column-select
                        v-if="groupingSchema.length > 0"
                        :schema="groupingSchema"
                        @change="toggleGroupingColumn"
                      />
                      <p v-else class="text-sm text-gray-800 text-center">Нет данных для отображения</p>
                    </div>
                  </div>
                </div>

                <div class="basis-2/3 flex flex-col overflow-hidden">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-900">
                    <p class="text-xl font-semibold">Определите, какие данные показать для остальных столбцов:</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-auto">
                    <div class="w-full p-4 relative flex justify-center">
                      <grouping-column-actions
                        v-if="schema.length > 0"
                        :schema="groupingSchema"
                        @change="updateGroupingAction"
                      />
                      <p v-else class="text-sm text-gray-800 text-center">Нет данных для отображения</p>
                    </div>
                  </div>
                </div>
                <div class="-mt-2 basis-12 flex gap-2 items-center justify-end">
                  <button
                    ref="buttonCancel"
                    class="relative px-4 inline-flex items-center h-full rounded-md border border-gray-400 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                    @click="cancel"
                  >
                    <x-mark-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                    <span>Отмена</span>
                  </button>
                  <button
                    type="button"
                    :class="[isValid ? 'hover:bg-teal-700' : 'opacity-50 cursor-default']"
                    class="inline-flex items-center min-w-max rounded-md border border-transparent bg-teal-600 px-4 h-full text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    @click="group"
                  >
                    <chevron-right-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                    Произвести группировку
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import { XMarkIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  import type { GroupingMixin, GroupingReactiveTableSchema, ReactiveTableSchema } from '../data/types';

  import GroupingColumnSelect from './GroupingColumnSelect.vue';
  import GroupingColumnActions from './GroupingColumnActions.vue';

  const buttonCancel = ref(null);
  const isValid = computed<boolean>(() => {
    return (
      groupingSchema.value.some((column) => column.grouping.action === 'group') &&
      groupingSchema.value.some((column) => column.grouping.action !== 'group') &&
      groupingSchema.value.every((column) => column.grouping.action !== 'none') &&
      groupingSchema.value
        .filter((column) => ['nth', 'all', 'unique'].includes(column.grouping.action))
        .every((column) => !!column.grouping.param)
    );
  });

  interface Props {
    isVisible: boolean;
    schema: ReactiveTableSchema;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'cancel'): void;
    (e: 'group', groupingSchema: GroupingReactiveTableSchema): void;
  }
  const emit = defineEmits<Emits>();

  const groupingSchema = ref<GroupingReactiveTableSchema>([]);
  const groupingSchemaBackup = ref<GroupingReactiveTableSchema>([]);
  watch(
    () => props.schema,
    (newValue, oldValue) => {
      const newColumnKeys = newValue.map((column) => column.key);
      const oldColumnKeys = oldValue.map((column) => column.key);
      if (newColumnKeys.some((key, idx) => key !== oldColumnKeys[idx])) {
        groupingSchema.value = newValue.map((column) => ({ ...column, grouping: { action: 'hide' } }));
      }
    }
  );

  function toggleGroupingColumn(originKey: string, columnKey: string): void {
    const idx = groupingSchema.value.findIndex((column) => column.origin.key === originKey && column.key === columnKey);
    if (idx < 0) return;

    if (groupingSchema.value[idx].grouping.action === 'group') {
      groupingSchema.value[idx].grouping.action = 'hide';
      groupingSchema.value[idx].grouping.param = undefined;
    } else {
      groupingSchema.value[idx].grouping.action = 'group';
      groupingSchema.value[idx].grouping.param = undefined;
    }
  }

  function updateGroupingAction(originKey: string, columnKey: string, groupingMixin: GroupingMixin): void {
    const idx = groupingSchema.value.findIndex((column) => column.origin.key === originKey && column.key === columnKey);
    if (idx < 0) return;

    groupingSchema.value[idx].grouping.action = groupingMixin.grouping.action;
    groupingSchema.value[idx].grouping.param = groupingMixin.grouping.param;
  }

  function cancel(): void {
    emit('cancel');
  }

  function group(): void {
    if (isValid.value) emit('group', groupingSchema.value);
  }

  function clearGrouping(): void {
    groupingSchema.value = props.schema.map((column) => ({ ...column, grouping: { action: 'hide' } }));
  }

  function backupGrouping(): void {
    groupingSchemaBackup.value = groupingSchema.value.map((column) => {
      const columnCopy = Object.assign({}, column);
      columnCopy.grouping = Object.assign({}, column.grouping);
      return columnCopy;
    });
  }

  function restoreGroupingBackup(): void {
    groupingSchema.value = groupingSchemaBackup.value.map((column) => {
      const columnCopy = Object.assign({}, column);
      columnCopy.grouping = Object.assign({}, column.grouping);
      return columnCopy;
    });
  }

  interface Exposes {
    clearGrouping(): void;
    backupGrouping(): void;
    restoreGroupingBackup(): void;
  }
  defineExpose<Exposes>({ clearGrouping, backupGrouping, restoreGroupingBackup });
</script>

<style scoped>
  .basis-remaining {
    flex-basis: calc(100% - 2.5rem);
  }
</style>
