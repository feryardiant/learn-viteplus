<script setup lang="ts">
import type { LinkProp } from './ExternalLink.vue'
import ExternalLink from './ExternalLink.vue'

export interface CardLinkProp extends LinkProp {
  icon: string
}

defineProps<{
  links: CardLinkProp[]
}>()
</script>

<template>
  <div>
    <slot></slot>

    <ul>
      <li v-for="(link, i) of $props.links" :key="i">
        <ExternalLink :href="link.href" :label="link.label">
          <slot name="icon" :icon="link.icon"></slot>
        </ExternalLink>
      </li>
    </ul>
  </div>
</template>
