<script setup lang="ts">
export interface LinkProp {
  href: string
  label: string
}

defineProps<LinkProp>()
</script>

<template>
  <a :href="$props.href" target="_blank">
    <slot></slot>

    <span>{{ $props.label }}</span>
  </a>
</template>
