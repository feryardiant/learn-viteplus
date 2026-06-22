<script setup lang="ts">
import Tick from '@/components/tick.vue'
</script>

<template>
  <header>
    <nav class="py-4">
      <router-link to="/">Home</router-link>
      <router-link to="/other">Other</router-link>
    </nav>
  </header>

  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <Tick />
  <section id="spacer" class="h-20 border-t border-t-border"></section>
</template>

<style scoped>
nav a {
  text-decoration: none;
  padding: 0.5em;
}

nav a.router-link-exact-active {
  text-decoration: underline;
}

#spacer {
  @media (max-width: 1024px) {
    height: 48px;
  }
}
</style>
