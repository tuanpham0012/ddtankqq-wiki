<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import WeaponDialog from '../components/WeaponDialog.vue'
import data from '../data/weapons.json'

const arts = import.meta.glob('../assets/weapons/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const artUrl = (item) => arts[`../assets/weapons/${item.image || `${item.id}.png`}`]

const query = ref('')
const opened = ref(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return data.items
  return data.items.filter((i) => `${i.nameVi} ${i.nameZh}`.toLowerCase().includes(q))
})
</script>

<template>
  <SiteHeader
    title="Vũ khí"
    subtitle="Chỉ số và hiệu quả mở khoá từng vũ khí"
    subtitle-zh="武器一览"
  />

  <section class="panel tools">
    <label class="search">
      <span class="sr-only">Tìm vũ khí</span>
      <input v-model="query" type="search" placeholder="Tìm theo tên Việt hoặc Trung…" />
    </label>
    <p class="count">Hiện {{ filtered.length }} / {{ data.items.length }} vũ khí</p>
  </section>

  <ul class="grid">
    <li v-for="it in filtered" :key="it.id">
      <button type="button" class="card" @click="opened = it">
        <span v-if="it.ex" class="ex">EX</span>
        <span v-if="it.typeZh" class="ty">{{ it.typeZh }}</span>
        <img v-if="artUrl(it)" class="ico" :src="artUrl(it)" :alt="it.nameVi" loading="lazy" />
        <span v-else class="ico ico-none" aria-hidden="true">?</span>
        <span class="nm">
          <span class="vi">{{ it.nameVi }}</span>
          <span class="zh">{{ it.nameZh }}</span>
        </span>
      </button>
    </li>
  </ul>

  <WeaponDialog :item="opened" :image="opened ? artUrl(opened) || '' : ''" @close="opened = null" />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Bấm vào vũ khí để xem chi tiết: chỉ số, các mốc mở khoá theo cấp (<b>解锁</b>)
        và mốc đột phá (<b>突破等级解锁</b>), kèm nguyên văn tiếng Trung.</li>
      <li>Dòng chữ <b>xanh nhạt</b> là hiệu quả chỉ có tác dụng trong PVE (<b>PVE生效</b>).</li>
      <li>Chỉ số hiển thị theo mức cường hoá ghi ở nhãn <b>强化等级</b>, chưa tính phù hiệu và trang bị khác.</li>
      <li>Thêm vũ khí: thêm một mục vào <b>src/data/weapons.json</b>, ảnh đặt vào
        <b>src/assets/weapons/</b> đúng tên trường <b>image</b> — trang tự nhận.</li>
    </ul>
  </section>
</template>

<style scoped>
.tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.search input{
  font:inherit;font-size:13px;color:var(--ink);padding:8px 12px;min-width:230px;
  border-radius:11px;background:#FFF8E7;border:2px solid #CFAF79;
}
.search input:focus{outline:3px solid var(--gold);outline-offset:1px}
.count{margin:0;font-size:12.5px;color:var(--ink-soft)}

.grid{
  list-style:none;margin:14px 0 0;padding:0;display:grid;gap:12px;
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
}
/* Thẻ trong cùng hàng luôn cao bằng nhau, khối tên dính đáy thẻ */
.grid li{display:flex}
.card{
  position:relative;display:flex;flex-direction:column;align-items:center;gap:7px;
  width:100%;height:100%;
  cursor:pointer;font:inherit;padding:12px 10px 11px;border-radius:14px;
  background:linear-gradient(180deg,#F5DFB0,#E8CB93);
  border:3px solid #C98A3A;box-shadow:0 5px 0 #6B3D20,0 10px 20px rgba(0,0,0,.24);
  transition:transform .1s ease, box-shadow .1s ease, filter .12s ease;
}
.card:hover{transform:translateY(-2px);box-shadow:0 7px 0 #6B3D20,0 14px 26px rgba(0,0,0,.3);filter:brightness(1.03)}
.card:active{transform:translateY(2px);box-shadow:0 2px 0 #6B3D20}
.card:focus-visible{outline:3px solid var(--gold);outline-offset:2px}

.ex{
  position:absolute;left:7px;top:7px;padding:1px 7px;border-radius:999px;
  font-size:10px;font-weight:800;color:#5A3306;
  background:linear-gradient(180deg,#F7D477,#E0A92C);border:1px solid #8A5A2B;
}
.ty{
  position:absolute;right:7px;top:7px;padding:1px 7px;border-radius:999px;
  font-size:10px;font-weight:800;color:#FFF8E7;
  background:#4F8F3C;border:1px solid rgba(0,0,0,.25);
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
