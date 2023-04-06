<template>
  <nav class="bg-white border-t">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full">
          <p class="text-sm text-slate-700">Показаны записи {{ rowNumberStart }} – {{ rowNumberEnd }} из {{ nrow }}</p>
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

            <div class="-mx-px px-2 h-full flex items-center gap-2 border border-slate-300 bg-white cursor-default">
              <p>Страница</p>
              <label for="page" class="sr-only">Страница</label>
              <input
                v-model="displayedPage"
                name="page"
                id="page"
                type="text"
                class="block p-2 w-7 h-7 border border-transparent rounded-md bg-slate-200 text-center focus:border-teal-500 focus:ring-teal-500"
                placeholder="1"
                @input="sanitizeNumberInput"
                @keyup.enter="emitUpdate"
                @blur="restore"
              />
              <p>из {{ maxPage }}</p>
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
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

  interface Props {
    nrow: number;
    limit: number;
    currentPage: number;
    maxPage: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update']);

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
