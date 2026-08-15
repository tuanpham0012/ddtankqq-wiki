<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import UpgradeDialog from '../components/UpgradeDialog.vue'
import data from '../data/upgrades.json'

const icons = import.meta.glob('../assets/upgrades/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const iconUrl = (item) => icons[`../assets/upgrades/${item.image || `${item.id}.png`}`]

const cost = ref('all')
const query = ref('')
const opened = ref(null)

const countByCost = computed(() => {
  const c = {}
  for (const i of data.items) c[i.cost] = (c[i.cost] || 0) + 1
  return c
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return data.items.filter((i) => {
    if (cost.value !== 'all' && i.cost !== cost.value) return false
    if (!q) return true
    return `${i.nameVi} ${i.nameZh}`.toLowerCase().includes(q)
  })
})

const withDetail = computed(() => data.items.filter((i) => i.detail).length)

// Mỗi loại mô-đun một màu, giống thanh tiêu đề trong game
const MODULE_COLORS = {
  α: '#D9A62B', β: '#D64C97', γ: '#8E56C6', π: '#2E9BD6', ψ: '#4FA83C',
}
const toneOf = (it) => MODULE_COLORS[it.detail?.moduleZh?.slice(0, 1)] || '#C9A96E'
</script>

<template>
  <SiteHeader
    title="Siêu cải tiến — Mô-đun"
    subtitle="Danh sách mô-đun theo cost"
    subtitle-zh="超级改造：模组一览"
  />

  <section class="panel tools">
    <div class="chips">
      <button type="button" class="chip" :class="{ on: cost === 'all' }" @click="cost = 'all'">
        Tất cả <b>{{ data.items.length }}</b>
      </button>
      <button v-for="c in data.costs" :key="c" type="button"
              class="chip" :class="{ on: cost === c }" @click="cost = c">
        cost {{ c }} <b>{{ countByCost[c] || 0 }}</b>
      </button>
    </div>
    <label class="search">
      <span class="sr-only">Tìm mô-đun</span>
      <input v-model="query" type="search" placeholder="Tìm theo tên Việt hoặc Trung…" />
    </label>
  </section>

  <p class="count">
    Hiện {{ filtered.length }} / {{ data.items.length }} mô-đun ·
    đã có chi tiết <b>{{ withDetail }}</b>
  </p>

  <ul class="grid">
    <li v-for="it in filtered" :key="it.id">
      <button type="button" class="card" :style="{ '--c': toneOf(it) }" @click="opened = it">
        <span class="cost">{{ it.cost }}</span>
        <span v-if="it.detail?.moduleZh" class="mod">
          {{ it.detail.moduleZh.slice(0, 1) }}{{ it.detail.moduleNo }}
        </span>
        <img v-if="iconUrl(it)" class="ico" :src="iconUrl(it)" :alt="it.nameVi" loading="lazy" />
        <span class="nm">
          <span class="vi">{{ it.nameVi }}</span>
          <span class="zh">{{ it.nameZh }}</span>
        </span>
      </button>
    </li>
  </ul>

  <UpgradeDialog :item="opened" :image="opened ? iconUrl(opened) : ''" @close="opened = null" />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Bấm vào mô-đun để xem chi tiết: phẩm chất, loại mô-đun, đợt ra mắt, chỉ số và sở trường.</li>
      <li>Đã có đủ chi tiết cho <b>{{ withDetail }}/{{ data.items.length }}</b> mô-đun.</li>
      <li>Mỗi mức cost dùng một loại mô-đun riêng, viền thẻ tô theo màu đó:
        <b>cost 1 = α</b> (vàng), <b>cost 2 = β</b> (hồng), <b>cost 3 = γ</b> (tím),
        <b>cost 4 = π</b> (xanh dương), <b>cost 5 = ψ</b> (xanh lá). Góc phải thẻ ghi số thứ tự mô-đun.</li>
      <li><b>Đợt (期)</b> là kỳ ra mắt của mô-đun trong game, hiện ở hộp thoại chi tiết.</li>
      <li>Sửa số liệu: chỉnh trường <b>detail</b> theo <b>id</b> trong <b>src/data/upgrades.json</b> — trang tự nhận.</li>
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
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
}
.card{
  position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;width:100%;
  cursor:pointer;font:inherit;padding:12px 10px 11px;border-radius:14px;
  background:linear-gradient(180deg,#F5DFB0,#E8CB93);
  /* Viền theo loại mô-đun: α vàng, β hồng, γ tím, π xanh dương, ψ xanh lá */
  border:3px solid var(--c,#C9A96E);box-shadow:0 5px 0 #6B3D20,0 10px 20px rgba(0,0,0,.24);
  transition:transform .1s ease, box-shadow .1s ease, filter .12s ease;
}
.card:hover{transform:translateY(-2px);box-shadow:0 7px 0 #6B3D20,0 14px 26px rgba(0,0,0,.3);filter:brightness(1.03)}
.card:active{transform:translateY(2px);box-shadow:0 2px 0 #6B3D20}
.card:focus-visible{outline:3px solid var(--gold);outline-offset:2px}

.mod{
  position:absolute;right:7px;top:7px;padding:1px 7px;border-radius:999px;
  font-size:10.5px;font-weight:800;color:#FFF8E7;
  background:var(--c,#8A5A2B);border:1px solid rgba(0,0,0,.25);
}

.cost{
  position:absolute;left:7px;top:7px;min-width:20px;height:20px;padding:0 6px;border-radius:999px;
  display:grid;place-items:center;font-size:11px;font-weight:800;color:#5A3306;
  background:linear-gradient(180deg,#F7D477,#E0A92C);border:1px solid #8A5A2B;
}
.ico{
  width:76px;height:76px;border-radius:12px;object-fit:cover;
  border:2px solid #C9A96E;background:#EBD6A8;
}
.nm{display:flex;flex-direction:column;line-height:1.2;text-align:center}
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
