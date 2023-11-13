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
              class="relative w-full flex flex-col p-6 transform overflow-hidden rounded-xl bg-slate-300 text-left shadow-xl transition-all xl:w-4/5"
              style="height: 80vh"
            >
              <div class="flex-1 flex gap-6 overflow-hidden">
                <div class="basis-1/3 flex-shrink-0 flex-grow-0 flex flex-col lg:basis-1/4">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-900">
                    <p class="text-xl font-semibold">{{ t('query.query') }}</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-auto">
                    <query-edit-column-list v-if="selectedSchema.length > 0" :schema="selectedSchema" />
                    <p v-else class="p-4 text-sm text-gray-800 text-center">{{ t('query.no_data') }}</p>
                  </div>
                </div>

                <div class="basis-2/3 flex flex-col lg:basis-3/4">
                  <div class="flex mb-2 ml-2 items-center justify-between text-slate-900">
                    <p class="text-xl font-semibold">{{ t('query.available_data') }}</p>
                  </div>

                  <div class="h-full rounded-xl bg-white overflow-auto">
                    <div class="w-full p-4 relative flex justify-center">
                      <query-edit-column-select v-if="schema.length > 0" :schema="schema" @change="emitChange" />
                      <p v-else class="text-sm text-gray-800 text-center">{{ t('query.no_data') }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 basis-10 flex gap-2 items-center justify-end">
                <button
                  ref="buttonCancel"
                  class="relative px-4 inline-flex items-center h-full rounded-md border border-gray-400 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                  @click="cancel"
                >
                  <x-mark-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                  <span>{{ t('query.cancel') }}</span>
                </button>
                <button
                  type="button"
                  :class="
                    !isRequestSent
                      ? 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
                      : 'bg-teal-700'
                  "
                  class="relative px-4 inline-flex items-center h-full rounded-md border border-transparent text-sm font-medium shadow-sm"
                  @click="sendQuery"
                >
                  <span
                    :class="isRequestSent ? 'text-transparent' : 'text-white'"
                    class="mx-auto inline-flex items-center"
                  >
                    <chevron-right-icon class="-ml-2 mr-1 h-5 w-5" aria-hidden="true" />
                    {{ t('query.submit') }}</span
                  >
                  <span
                    v-if="isRequestSent"
                    class="absolute top-1/2 left-1/2 h-7 w-7 rounded-full border-4 border-l-white border-t-white border-r-white border-b-teal-700 animate-spin -translate-x-1/2 -translate-y-1/2"
                  ></span>
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
  import { ref, computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
  import { XMarkIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';
  import type { ReactiveTableSchemaInfo } from '../data/types';

  import QueryEditColumnList from './QueryEditColumnList.vue';
  import QueryEditColumnSelect from './QueryEditColumnSelect.vue';

  const { t } = useI18n();

  const isRequestSent = ref(false);
  const buttonCancel = ref(null);

  interface Props {
    isVisible: boolean;
    schema: ReactiveTableSchemaInfo;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'cancel'): void;
    (e: 'change', at: { originKey: string; columnKey: string }): void;
    (e: 'sendQuery'): void;
  }
  const emit = defineEmits<Emits>();

  watch(
    () => props.isVisible,
    () => {
      if (props.isVisible) {
        isRequestSent.value = false;
      }
    }
  );

  const selectedSchema = computed(() => props.schema.filter((column) => column.selected));

  function emitChange(at: { originKey: string; columnKey: string }) {
    emit('change', at);
  }

  function sendQuery() {
    if (props.schema.some((column) => column.selected)) {
      isRequestSent.value = true;
      emit('sendQuery');
    }
  }

  function cancel() {
    emit('cancel');
  }
</script>
