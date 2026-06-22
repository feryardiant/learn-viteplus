<script setup lang="ts"></script>

<template>
  <div class="ticks relative w-full"></div>
</template>

<style>
.ticks::before,
.ticks::after {
  content: '';
  position: absolute;
  top: -4.5px;
  border: 5px solid transparent;
}

.ticks::before {
  left: 0;
  border-left-color: var(--color-border);
}

.ticks::after {
  right: 0;
  border-right-color: var(--color-border);
}
</style>
