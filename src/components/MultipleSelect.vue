<template>
  <Listbox as="div" v-model="selectedOptions" multiple>
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white py-1 pl-3 pr-10 text-left text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
      >
        <span class="block whitespace-pre-wrap h-8" style="max-height: 1.5rem">{{ selectedOptions.join(', ') }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="option in props.options"
            :key="option"
            :value="option"
            v-slot="{ active, selected }"
            class="cursor-default"
          >
            <li
              :class="[
                selected ? 'bg-teal-100' : '',
                active ? '!bg-teal-600 text-white' : 'text-gray-900',
                'relative select-none py-2 pl-8 pr-4 focus:outline-none',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option }}</span>

              <span
                v-if="selected"
                :class="[active ? 'text-white' : 'text-teal-600', 'absolute inset-y-0 left-0 flex items-center pl-1.5']"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
  import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid';

  interface Props {
    options: string[];
    selected: string[];
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['change']);

  const selectedOptions = ref<string[]>(props.selected);

  watch(selectedOptions, (newValue) => {
    emit('change', Array.from(newValue));
  });
</script>
