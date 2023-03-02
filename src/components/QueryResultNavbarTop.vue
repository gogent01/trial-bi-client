<template>
  <nav class="bg-white border-b">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full">
          <p class="text-slate-600">По запросу было найдено 150 записей</p>
        </div>
        <div class="flex items-center gap-4 h-full">

          <div class="flex-shrink-0 h-full">
            <button type="button" class="relative inline-flex items-center rounded-md border border-transparent bg-teal-600 h-full px-4 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              <arrow-down-tray-icon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Сохранить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/20/solid'
</script>
