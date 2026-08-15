<script setup>
/**
 * Danh sách hiệu ứng kỹ năng, tự gọi lại chính nó nên lồng được bao nhiêu cấp cũng được
 * (game có chỗ lồng 3 cấp: hiệu ứng → ①②③ → tỉ lệ %).
 */
defineProps({
  items: { type: Array, required: true },
  level: { type: Number, default: 0 },
})
</script>

<template>
  <ol v-if="level === 0" class="fx">
    <li v-for="(e, i) in items" :key="i">
      <p class="vi">{{ e.vi }}</p>
      <p v-if="e.zh" class="zh">{{ e.zh }}</p>
      <SkillEffects v-if="e.sub?.length" :items="e.sub" :level="level + 1" />
    </li>
  </ol>

  <ul v-else class="fx nested">
    <li v-for="(e, i) in items" :key="i">
      <p class="vi">{{ e.vi }}</p>
      <p v-if="e.zh" class="zh">{{ e.zh }}</p>
      <SkillEffects v-if="e.sub?.length" :items="e.sub" :level="level + 1" />
    </li>
  </ul>
</template>

<style scoped>
.fx{margin:11px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:9px}
.fx > li::marker{color:#F7D477;font-weight:800}
.fx.nested{
  list-style:none;margin:6px 0 0;padding:0 0 0 10px;gap:6px;
  border-left:2px solid #6B5340;
}
.vi{margin:0;font-size:13px;line-height:1.6}
.nested .vi{font-size:12.5px}
.zh{margin:2px 0 0;font-size:11.5px;line-height:1.5;color:#A9946F}
</style>
