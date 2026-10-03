<script setup lang="ts"></script>

<template>
  <div
    :class="[
      'ticks',
      'relative',
      'w-full',
      'before:content-[\'\']',
      'after:content-[\'\']',
      'before:absolute',
      'after:absolute',
      'before:top-[-4.5px]',
      'after:top-[-4.5px]',
      'before:border-5',
      'after:border-5',
      'before:border-transparent',
      'after:border-transparent',
      'before:left-[0]',
      'after:right-[0]',
      'before:border-left-border',
      'after:border-right-border',
    ]"
  ></div>
</template>

<style>
/*@layer components {
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
}*/
</style>
