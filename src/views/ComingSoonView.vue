<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '../components/SiteHeader.vue'

const route = useRoute()
const item = computed(() => route.meta.menu || {})
</script>

<template>
  <SiteHeader :title="item.label || 'Sắp có'" :subtitle-zh="item.labelZh || ''" />

  <section class="panel">
    <h2>Trang này chưa có nội dung</h2>
    <ul>
      <li>Thêm dữ liệu vào <b>src/data/</b>, viết view mới trong <b>src/views/</b>.</li>
      <li>Khai báo view đó trong <b>src/router/index.js</b> (object <b>views</b>), rồi đổi <b>ready: true</b> cho mục
        <b>{{ item.key }}</b> trong <b>src/data/menu.json</b>.</li>
    </ul>
  </section>
</template>
