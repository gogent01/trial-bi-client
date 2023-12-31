<template>
  <nav class="bg-white border-t">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full">
          <p class="hidden text-sm text-slate-700 lg:block">
            {{ t('query_result.record_count_on_page', { rowNumberStart, rowNumberEnd, nrow }) }}
          </p>
        </div>
        <div class="flex items-center gap-4 h-full">
          <div class="flex items-center h-full text-slate-600">
            <button
              :class="[currentPage > 1 ? 'hover:bg-gray-50' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center justify-center w-10 rounded-l-md border border-slate-300 bg-white h-full"
              @click="incrementPage(-1)"
            >
              <chevron-left-icon class="h-7 w-7" aria-hidden="true" />
            </button>

            <div
              class="-mx-px px-2 h-full flex items-center gap-1.5 border border-slate-300 bg-white text-sm cursor-default lg:gap-2 lg:text-base"
            >
              <p>{{ t('query_result.page') }}</p>
              <label for="page" class="sr-only">{{ t('query_result.page') }}</label>
              <input
                v-model="displayedPage"
                name="page"
                id="page"
                type="text"
                class="block p-2 w-7 h-7 border border-transparent rounded-md bg-slate-200 text-center text-sm focus:border-teal-500 focus:ring-teal-500 lg:text-base"
                placeholder="1"
                @input="sanitizeNumberInput"
                @keyup.enter="emitUpdate"
                @blur="restore"
              />
              <p>{{ t('query_result.out_of') }} {{ maxPage }}</p>
            </div>

            <button
              :class="[currentPage < maxPage ? 'hover:bg-gray-50' : 'opacity-50 cursor-default']"
              class="relative inline-flex items-center justify-center w-10 rounded-r-md border border-slate-300 bg-white h-full"
              @click="incrementPage(1)"
            >
              <chevron-right-icon class="h-7 w-7" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

  const { t } = useI18n();

  interface Props {
    nrow: number;
    limit: number;
    currentPage: number;
    maxPage: number;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'update', value: number): void;
  }
  const emit = defineEmits<Emits>();

  const rowNumberStart = computed(() => Math.min((props.currentPage - 1) * props.limit + 1, props.nrow));
  const rowNumberEnd = computed(() => Math.min(rowNumberStart.value + props.limit - 1, props.nrow));

  const displayedPage = ref(props.currentPage.toString());
  watchEffect(() => {
    displayedPage.value = props.currentPage.toString();
  });

  function restore() {
    displayedPage.value = props.currentPage.toString();
  }

  function emitUpdate() {
    const displayedPageNumber = parseInt(displayedPage.value, 10);
    if (displayedPageNumber === props.currentPage) return;
    if (displayedPageNumber < 1 || displayedPageNumber > props.maxPage) {
      displayedPage.value = props.currentPage.toString();
      return;
    }

    emit('update', parseInt(displayedPage.value, 10));
  }

  function incrementPage(delta: number) {
    const displayedPageNumber = parseInt(displayedPage.value, 10);
    if (displayedPageNumber + delta < 1) return;
    if (displayedPageNumber + delta > props.maxPage) return;

    displayedPage.value = (displayedPageNumber + delta).toString();
    emit('update', parseInt(displayedPage.value, 10));
  }

  function sanitizeNumberInput(event: Event) {
    const input = event.target! as HTMLInputElement;

    input.value = input.value.replace(/[^0-9]/g, '');
  }
</script>
