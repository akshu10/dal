<template>
  <div>
    <div class="flex">
      <Navbar />
      <div class="container px-4 py-4">
        <RouterView />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
</script>
<style>
@import '@/assets/css/tailwind.css';
</style>
