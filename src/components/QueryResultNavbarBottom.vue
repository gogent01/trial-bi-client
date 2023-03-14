<template>
  <nav class="bg-white border-t">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full"></div>
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
                type="number"
                class="block p-2 w-7 h-7 border border-transparent rounded-md bg-slate-300 text-center focus:border-teal-500 focus:ring-teal-500"
                placeholder="1"
                @keyup.enter="emitUpdate"
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
  import { ref, watchEffect } from 'vue';
  import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid';

  interface Props {
    currentPage: number;
    maxPage: number;
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['update']);

  const displayedPage = ref(props.currentPage);
  watchEffect(() => {
    displayedPage.value = props.currentPage;
  });

  function emitUpdate() {
    if (displayedPage.value === props.currentPage) return;
    if (displayedPage.value < 1 || displayedPage.value > props.maxPage) {
      displayedPage.value = props.currentPage;
      return;
    }

    emit('update', displayedPage.value);
  }

  function incrementPage(delta: number) {
    if (displayedPage.value + delta < 1) return;
    if (displayedPage.value + delta > props.maxPage) return;

    displayedPage.value = displayedPage.value + delta;
    emit('update', displayedPage.value);
  }
</script>
