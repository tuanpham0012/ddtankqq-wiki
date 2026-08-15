<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  subtitleZh: { type: String, default: '' },
})
</script>

<template>
  <header>
    <div class="sign">
      <h1>{{ title }}</h1>
      <p v-if="subtitle || subtitleZh" class="sub">
        {{ subtitle }}<template v-if="subtitle && subtitleZh"> · </template><b v-if="subtitleZh">{{ subtitleZh }}</b>
      </p>
    </div>
  </header>
</template>
