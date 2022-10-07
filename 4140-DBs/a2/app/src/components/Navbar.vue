<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="h-screen flex-1 flex flex-col min-h-0 bg-gray-800">
    <div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div class="flex items-center flex-shrink-0 px-4"></div>
      <nav class="mt-5 flex-1 px-2 bg-gray-800 space-y-1" aria-label="Sidebar">
        <a
          v-for="item in navigation"
          :key="item.name"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
          ]"
        >
          <component
            :is="item.icon"
            :class="[
              item.current
                ? 'text-gray-300'
                : 'text-gray-400 group-hover:text-gray-300',
              'mr-3 flex-shrink-0 h-6 w-6',
            ]"
            aria-hidden="true"
          />
          <span class="flex-1">
            {{ item.name }}
          </span>
          <span
            v-if="item.count"
            :class="[
              item.current
                ? 'bg-gray-800'
                : 'bg-gray-900 group-hover:bg-gray-800',
              'ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full',
            ]"
          >
            {{ item.count }}
          </span>
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

import { FolderIcon, HomeIcon, InboxIcon } from "@heroicons/vue/outline";

// import { useReferralsStore, useClinicalNotesStore } from "../stores";

const route = useRoute();
// const referralsStore = useReferralsStore();
// const clinicalNotesStore = useClinicalNotesStore();

// const referralCount = computed((): number => {
//   return referralsStore.referralCount;
// });

// const clientsCount = computed((): number => {
//   return referralsStore.clientCount;
// });

// const clinicalNotesCount = computed((): number => {
//   return clinicalNotesStore.count;
// });

// TODO implement this - Watch when path changes and update the current
const current = (name: string): boolean => {
  console.log("path name", route.path);

  if (route.path.startsWith("/referrals") && name === "Referrals") {
    return true;
  }
  return false;
};

const navigation = [
  {
    name: "Dashboard",
    icon: HomeIcon,
    href: "/",
    current: current("Dashboard"),
  },
  {
    name: "Documents",
    icon: InboxIcon,
    href: "/documents",
    current: current("Documents"),
  },
  // {
  //   name: "Calendar",
  //   icon: CalendarIcon,
  //   href: "/calendar",
  //   current: current("Calendar"),
  // },
  // {
  //   name: "Reports",
  //   icon: ChartBarIcon,
  //   href: "/reports",
  //   count: 12,
  //   current: current("Reports"),
  // },
  // {
  //   name: "Users",
  //   icon: UsersIcon,
  //   href: "/users",
  //   count: 3,
  //   current: current("Users"),
  // },
];

// onMounted(async () => {
//   referralsStore.findReferrals();
//   referralsStore.findClients();
// });
</script>
