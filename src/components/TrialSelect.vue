<template>
  <Listbox as="div" :default-value="selectedTrialInfo" @update:model-value="emitUpdate">
    <div class="relative">
      <ListboxButton
        class="h-10 min-w-max relative pl-3 pr-10 cursor-default rounded-lg bg-teal-900 text-sm text-left text-white font-medium border border-transparent shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600 leading-6"
      >
        <span class="block truncate">{{ selectedTrialInfo.text }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon class="h-5 w-5 text-white" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="min-w-max absolute right-0 z-10 mt-1 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="option in trialInfos"
            :key="option.value"
            :value="option"
            :disabled="option.unavailable"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-teal-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{ option.text }}</span>

              <span
                v-if="selected"
                :class="[active ? 'text-white' : 'text-teal-600', 'absolute inset-y-0 right-0 flex items-center pr-4']"
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
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
  import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/20/solid';
  import type { Trial } from '../data/types';
  import { CURRENT_LOCALE } from '../config/variables';

  const { t } = useI18n();

  interface Props {
    trials: Trial[];
    selectedTrialIdx: number;
  }
  const props = defineProps<Props>();

  interface Emits {
    (e: 'update', trialIdx: number): void;
  }
  const emit = defineEmits<Emits>();

  type TrialInfo = {
    value: string;
    text: string;
    idx: number;
    unavailable: boolean;
  };

  const trialInfos = computed<TrialInfo[]>(() => {
    return [
      {
        value: 'none',
        text: t('trial.select_trial'),
        idx: -1,
        unavailable: true,
      },
    ].concat(
      props.trials.map((trial, idx) => ({
        value: trial.key,
        text: t('trial.trial_info', {
          name: trial.name,
          updated_at: trial.updated_at.toLocaleDateString(CURRENT_LOCALE),
        }),
        idx,
        unavailable: false,
      }))
    );
  });

  const selectedTrialInfo = computed<TrialInfo>(() => {
    return trialInfos.value.find((trial) => trial.idx === props.selectedTrialIdx)!;
  });

  function emitUpdate(trial: TrialInfo) {
    emit('update', trial.idx);
  }
</script>
