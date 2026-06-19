<script setup lang="ts">
import heroImg from '@/assets/hero.png'
import typescriptLogo from '@/assets/typescript.svg'
import viteLogo from '@/assets/vite.svg'
import Card, { type CardLinkProp } from '@/components/card.vue'
import Tick from '@/components/tick.vue'
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
    <div class="hero relative">
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

  <Tick />

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
        <svg class="button-icon dark:invert dark:brightness-200" role="presentation" aria-hidden="true">
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

<style scoped>
.hero .base,
.hero .framework,
.hero .vite {
  inset-inline: 0;
  margin: 0 auto;
}

.hero .base {
  width: 170px;
  position: relative;
  z-index: 0;
}

.hero .framework,
.hero .vite {
  position: absolute;
}

.hero .framework {
  z-index: 1;
  top: 34px;
  height: 28px;
  transform: perspective(2000px) rotateZ(300deg) rotateX(44deg) rotateY(39deg) scale(1.4);
}

.hero .vite {
  z-index: 0;
  top: 107px;
  height: 26px;
  width: auto;
  transform: perspective(2000px) rotateZ(300deg) rotateX(40deg) rotateY(39deg) scale(0.8);
}

#counter {
  margin-bottom: 24px;
}

.counter {
  font-family: var(--font-mono);
  display: inline-flex;
  border-radius: 4px;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 5px;
  color: var(--color-accent);
  background: var(--color-accent-bg);
  border: 2px solid transparent;
  transition: border-color 0.3s;
  margin: 0 2px;
}

.counter:hover {
  border-color: var(--color-accent-border);
}

.counter:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

#next-steps {
  display: flex;
  border-top: 1px solid var(--color-border);
  text-align: left;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
}

#next-steps > :deep(div) {
  flex: 1 1 0;
  padding: 32px;

  @media (max-width: 1024px) {
    padding: 24px 20px;
  }
}

#next-steps .icon {
  margin-bottom: 16px;
  width: 22px;
  height: 22px;
}

#docs {
  border-right: 1px solid var(--color-border);

  @media (max-width: 1024px) {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}

#next-steps :deep(ul) {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 8px;
  margin: 32px 0 0;

  @media (max-width: 1024px) {
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
}

#next-steps :deep(ul li) {
  @media (max-width: 1024px) {
    flex: 1 1 calc(50% - 8px);
  }
}

#next-steps :deep(ul a) {
  color: var(--color-text-heading);
  font-size: 16px;
  border-radius: 6px;
  background: var(--color-social-bg);
  display: flex;
  padding: 6px 12px;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: box-shadow 0.3s;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
    box-sizing: border-box;
  }
}

#next-steps :deep(ul a:hover) {
  box-shadow: var(--shadow-custom);
}

#next-steps :deep(ul a .button-icon) {
  height: 18px;
  width: 18px;
}

#next-steps .logo {
  height: 18px;
}
</style>
