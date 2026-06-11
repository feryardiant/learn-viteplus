<script setup lang="ts">
import heroImg from '@/assets/hero.png'
import typescriptLogo from '@/assets/typescript.svg'
import viteLogo from '@/assets/vite.svg'
import Card, { type CardLinkProp } from '@/components/Card.vue'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()

const docLinks: CardLinkProp[] = [
  { href: 'https://vite.dev/', label: 'Explore Vite', icon: viteLogo },
  { href: 'https://www.typescriptlang.org', label: 'Learn more', icon: typescriptLogo },
]

const socialLinks: CardLinkProp[] = [
  { href: 'https://github.com/vitejs/vite', label: 'GitHub', icon: '/icons.svg#github-icon' },
  { href: 'https://chat.vite.dev/', label: 'Discord', icon: '/icons.svg#discord-icon' },
  { href: 'https://x.com/vite_js', label: 'X.com', icon: '/icons.svg#x-icon' },
  { href: 'https://bsky.app/profile/vite.dev', label: 'Bluesky', icon: '/icons.svg#bluesky-icon' },
]
</script>

<template>
  <section id="center">
    <div class="hero">
      <img :src="heroImg" class="base" width="170" height="179" />
      <img :src="typescriptLogo" class="framework" alt="TypeScript logo" />
      <img :src="viteLogo" class="vite" alt="Vite logo" />
    </div>

    <div>
      <h1>Get started</h1>
      <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
    </div>

    <div id="counter">
      <button type="button" class="counter" @click="() => counter.increment()">Count is {{ counter.count }}</button>

      <button type="reset" class="counter" @click="() => counter.reset()">Reset</button>
    </div>
  </section>

  <div class="ticks"></div>

  <section id="next-steps">
    <Card id="docs" :links="docLinks">
      <template #icon="{ icon }">
        <img class="logo" :src="icon" alt="" />
      </template>

      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>

      <h2>Documentation</h2>
      <p>Your questions, answered</p>
    </Card>

    <Card id="social" :links="socialLinks">
      <template #icon="{ icon }">
        <svg class="button-icon" role="presentation" aria-hidden="true">
          <use :href="icon"></use>
        </svg>
      </template>

      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>

      <h2>Connect with us</h2>
      <p>Join the Vite community</p>
    </Card>
  </section>
</template>
