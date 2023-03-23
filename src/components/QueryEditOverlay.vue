<template>
  <TransitionRoot as="template" :show="isVisible">
    <Dialog :initialFocus="buttonCancel" as="div" class="relative z-10" @close="emit('close')">
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
              class="relative flex flex-col p-6 transform overflow-hidden rounded-lg bg-slate-300 text-left shadow-xl transition-all w-2/3"
              style="height: 80vh"
            >
              <div class="h-full flex gap-6">
                <div class="basis-1/4 flex-shrink-0 flex-grow-0 flex flex-col">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-700">
                    <p class="text-xl font-semibold">Запрос</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-hidden">
                    <div class="relative flex justify-center p-3 overflow-auto">
                      <div class="w-full">
                        <p class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="basis-3/4 flex flex-col">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-700">
                    <p class="text-xl font-semibold">Доступные данные</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-auto">
                    <div class="relative flex justify-center p-4">
                      <div class="w-full">
                        <query-edit-column-select v-if="schema.length > 0" :schema="schema" @change="emitChange" />
                        <p v-else class="text-sm text-gray-600 text-center">Нет данных для отображения</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 h-10 flex gap-2 items-center justify-end">
                <button
                  ref="buttonCancel"
                  class="relative px-4 inline-flex items-center h-full rounded-md border border-gray-400 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-gray-100"
                  @click="emit('close')"
                >
                  <x-mark-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                  <span>Отмена</span>
                </button>
                <button
                  type="button"
                  class="relative px-4 inline-flex items-center h-full rounded-md border border-transparent bg-teal-600 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  <chevron-right-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                  Отправить запрос
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import { XMarkIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  import type { ReactiveTableSchemaInfo } from '@/data/types';

  import QueryEditColumnSelect from '@/components/QueryEditColumnSelect.vue';

  const buttonCancel = ref(null);

  interface Props {
    isVisible: boolean;
    schema: ReactiveTableSchemaInfo;
  }
  const props = defineProps<Props>();
  const emit = defineEmits(['change', 'sendQuery', 'close']);

  function emitChange(at: { originKey: string; columnKey: string }) {
    emit('change', at);
  }
</script>
