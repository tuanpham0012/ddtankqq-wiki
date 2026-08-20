<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import SoulBodyDialog from '../components/SoulBodyDialog.vue'
import data from '../data/soul-bodies.json'

const arts = import.meta.glob('../assets/soul-bodies/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const artUrl = (item) => arts[`../assets/soul-bodies/${item.image || `${item.id}.png`}`]

const type = ref('all')
const query = ref('')
const opened = ref(null)

const countByType = computed(() => {
  const c = {}
  for (const i of data.items) c[i.type] = (c[i.type] || 0) + 1
  return c
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return data.items.filter((i) => {
    if (type.value !== 'all' && i.type !== type.value) return false
    if (!q) return true
    return `${i.nameVi} ${i.nameZh}`.toLowerCase().includes(q)
  })
})

// Mỗi hệ một màu viền thẻ, khớp với màu trong hộp thoại chi tiết
const TYPE_COLORS = { 'trat-tu': '#D9A62B', 'hu-vo': '#8E56C6', 'sieu-nhien': '#2E9BD6' }
const toneOf = (it) => TYPE_COLORS[it.type] || '#C9A96E'
const typeLabel = (key) => data.types.find((t) => t.key === key) || {}
</script>

<template>
  <SiteHeader
    title="Hồn thể — Thần Điện"
    subtitle="Chỉ số và kỹ năng từng hồn thể"
    subtitle-zh="神殿：魂体一览"
  />

  <section class="panel tools">
    <div class="chips">
      <button type="button" class="chip" :class="{ on: type === 'all' }" @click="type = 'all'">
        Tất cả <b>{{ data.items.length }}</b>
      </button>
      <button v-for="t in data.types" :key="t.key" type="button"
              class="chip" :class="{ on: type === t.key }" @click="type = t.key">
        {{ t.labelVi }} <b>{{ countByType[t.key] || 0 }}</b>
      </button>
    </div>
    <label class="search">
      <span class="sr-only">Tìm hồn thể</span>
      <input v-model="query" type="search" placeholder="Tìm theo tên Việt hoặc Trung…" />
    </label>
  </section>

  <p class="count">Hiện {{ filtered.length }} / {{ data.items.length }} hồn thể</p>

  <ul class="grid">
    <li v-for="it in filtered" :key="it.id">
      <button type="button" class="card" :style="{ '--c': toneOf(it) }" @click="opened = it">
        <span class="ty">{{ typeLabel(it.type).labelZh }}</span>
        <img v-if="artUrl(it)" class="ico" :src="artUrl(it)" :alt="it.nameVi" loading="lazy" />
        <span v-else class="ico ico-none" aria-hidden="true">?</span>
        <span class="nm">
          <span class="vi">{{ it.nameVi }}</span>
          <span class="zh">{{ it.nameZh }}</span>
        </span>
      </button>
    </li>
  </ul>

  <SoulBodyDialog
    :item="opened"
    :image="opened ? artUrl(opened) || '' : ''"
    :types="data.types"
    @close="opened = null"
  />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Bấm vào hồn thể để xem chi tiết: hệ, chỉ số, từ điều và kỹ năng (kèm nguyên văn tiếng Trung).</li>
      <li>Viền thẻ tô theo hệ: <b>Trật tự</b> (vàng), <b>Hư Vô</b> (tím), <b>Siêu Nhiên</b> (xanh dương).
        Góc phải thẻ ghi tên hệ tiếng Trung.</li>
      <li>Thêm hồn thể: thêm một mục vào <b>src/data/soul-bodies.json</b>, ảnh đặt vào
        <b>src/assets/soul-bodies/</b> đúng tên trường <b>image</b> — trang tự nhận.</li>
    </ul>
  </section>
</template>

<style scoped>
.tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{
  display:inline-flex;align-items:center;gap:6px;cursor:pointer;
  font:inherit;font-size:12.5px;font-weight:700;color:var(--wood);
  padding:6px 13px;border-radius:999px;background:#EBD6A8;border:2px solid #CFAF79;
  transition:transform .08s ease, background .12s ease;
}
.chip:hover{transform:translateY(-1px);background:#F3E2BC}
.chip.on{background:linear-gradient(180deg,var(--wood-2),var(--wood));border-color:#35190C;color:#FBF1D8}
.chip b{font-size:11.5px;opacity:.75}
.search input{
  font:inherit;font-size:13px;color:var(--ink);padding:8px 12px;min-width:230px;
  border-radius:11px;background:#FFF8E7;border:2px solid #CFAF79;
}
.search input:focus{outline:3px solid var(--gold);outline-offset:1px}

.count{margin:14px 2px 10px;font-size:12px;color:#E7D3A5}
.count b{color:#F3C24B}

.grid{
  list-style:none;margin:0;padding:0;display:grid;gap:12px;
  /* align-items mặc định là stretch: mọi ô trong cùng hàng cao bằng nhau */
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
}
/* li căng hết chiều cao hàng, .card căng hết li -> thẻ trong 1 hàng luôn bằng nhau
   dù tên dài 1 hay 2 dòng; khối tên bị đẩy xuống đáy bằng margin-top:auto */
.grid li{display:flex}
.card{
  position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;height:100%;
  cursor:pointer;font:inherit;padding:12px 10px 11px;border-radius:14px;
  background:linear-gradient(180deg,#F5DFB0,#E8CB93);
  /* Viền theo hệ hồn thể */
  border:3px solid var(--c,#C9A96E);box-shadow:0 5px 0 #6B3D20,0 10px 20px rgba(0,0,0,.24);
  transition:transform .1s ease, box-shadow .1s ease, filter .12s ease;
}
.card:hover{transform:translateY(-2px);box-shadow:0 7px 0 #6B3D20,0 14px 26px rgba(0,0,0,.3);filter:brightness(1.03)}
.card:active{transform:translateY(2px);box-shadow:0 2px 0 #6B3D20}
.card:focus-visible{outline:3px solid var(--gold);outline-offset:2px}

.ty{
  position:absolute;right:7px;top:7px;padding:1px 7px;border-radius:999px;
  font-size:10.5px;font-weight:800;color:#FFF8E7;
  background:var(--c,#8A5A2B);border:1px solid rgba(0,0,0,.25);
}
.ico{
  flex:none;width:76px;height:76px;border-radius:12px;object-fit:cover;
  border:2px solid #C9A96E;background:#EBD6A8;
}
.ico-none{display:grid;place-items:center;font-size:26px;color:#B79A6A}
.nm{
  display:flex;flex-direction:column;justify-content:center;line-height:1.2;text-align:center;
  margin-top:auto;
}
.vi{font-family:"Baloo 2",cursive;font-weight:800;font-size:13px;color:var(--wood)}
.zh{font-size:10.5px;color:var(--ink-soft)}

.notes{margin-top:20px}

@media (max-width:620px){
  .grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:9px}
  .ico{width:60px;height:60px}
  .search{flex:1}
  .search input{min-width:0;width:100%}
}
</style>
