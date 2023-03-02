<template>
  <nav class="bg-white border-t">
    <div class="mx-auto">
      <div class="flex justify-between h-16 py-3 px-4">
        <div class="flex items-center h-full">

        </div>
        <div class="flex items-center gap-4 h-full">
          <div class="flex items-center h-full text-slate-600">
            <button class="relative inline-flex items-center justify-center w-10 rounded-l-md border border-slate-300 bg-white h-full hover:bg-gray-50">
              <chevron-left-icon class="h-7 w-7" aria-hidden="true" />
            </button>

            <div class="-mx-px px-2 h-full flex items-center gap-2 border border-slate-300 bg-gray-100">
              <p>Страница</p>
              <label for="page" class="sr-only">Страница</label>
              <input type="number" name="page" id="page" class="block w-7 h-7 rounded-md bg-gray-300 text-center focus:border-teal-500 focus:ring-teal-500" placeholder="1" value="1" />
              <p>из 3</p>
            </div>

            <button class="relative inline-flex items-center justify-center w-10 rounded-r-md border border-slate-300 bg-white h-full hover:bg-gray-50">
              <chevron-right-icon class="h-7 w-7" aria-hidden="true" />
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
