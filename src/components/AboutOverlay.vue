<template>
  <TransitionRoot as="template" :show="isVisible">
    <Dialog as="div" class="relative z-10" @close="close">
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
              class="relative flex flex-col p-6 transform overflow-hidden rounded-xl bg-slate-300 text-left shadow-xl transition-all"
            >
              <div class="w-full max-w-md text-center rounded-xl">
                <img
                  src="/og-image.png"
                  :alt="t('wide_screen.image_alt')"
                  width="1200"
                  height="630"
                  loading="lazy"
                  class="w-full max-w-md h-auto"
                />

                <h2 class="mt-3 text-xl font-semibold text-gray-900">Trial BI</h2>
                <p class="mt-1 text-gray-700">{{ t('wide_screen.description') }}</p>

                <a
                  href="https://github.com/gogent01/trial-bi-client"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="mt-2 inline-flex items-center gap-1 rounded-lg text-teal-700 underline underline-offset-2 decoration-from-font hover:no-underline"
                >
                  {{ t('wide_screen.source_code') }}
                  <arrow-top-right-on-square-icon class="h-5 w-5" aria-hidden="true" />
                </a>
              </div>

              <div class="mt-4 basis-10 flex gap-2 items-center justify-end">
                <button
                  ref="buttonClose"
                  class="relative px-4 inline-flex items-center h-full rounded-md border border-gray-400 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
                  @click="close"
                >
                  <span>{{ t('buttons.close') }}</span>
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
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';

  import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid';

  const { t } = useI18n();

  const isRequestSent = ref(false);
  const buttonClose = ref(null);

  interface Props {
    isVisible: boolean;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'close'): void;
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

  function close() {
    emit('close');
  }
</script>
