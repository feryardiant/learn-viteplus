<script setup lang="ts"></script>

<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/other">Other</router-link>
    </nav>
  </header>

  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template>
