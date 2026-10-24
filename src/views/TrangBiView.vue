<script setup>
import { ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import EquipmentDialog from '../components/EquipmentDialog.vue'
import data from '../data/equipment.json'

const arts = import.meta.glob('../assets/equipment/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const artUrl = (p) => arts[`../assets/equipment/${p.image || `${p.id}.png`}`]

// Gộp mọi món của mọi bộ thành một lưới, mỗi món nhớ bộ của nó để popup hiện hiệu quả bộ
const items = data.sets.flatMap((set) => set.pieces.map((p) => ({ ...p, set })))
const opened = ref(null)
</script>

<template>
  <SiteHeader
    title="Trang bị"
    subtitle="Thuộc tính truyền thuyết và hiệu quả bộ"
    subtitle-zh="装备 · 套装"
  />

  <ul class="grid">
    <li v-for="it in items" :key="it.id">
      <button type="button" class="card" @click="opened = it">
        <span class="sk">{{ it.slotVi }}</span>
        <img v-if="artUrl(it)" class="ico" :src="artUrl(it)" :alt="it.nameVi" loading="lazy" />
        <span v-else class="ico ico-none" aria-hidden="true">?</span>
        <span class="nm">
          <span class="vi">{{ it.nameVi }}</span>
          <span class="zh">{{ it.nameZh }}</span>
        </span>
      </button>
    </li>
  </ul>

  <EquipmentDialog
    :item="opened"
    :set="opened?.set"
    :image="opened ? artUrl(opened) || '' : ''"
    @close="opened = null"
  />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Bấm vào trang bị để xem <b>thuộc tính truyền thuyết</b> (传说属性) và toàn bộ <b>hiệu quả bộ</b> (套装效果).</li>
      <li>Thêm món/bộ: sửa <b>src/data/equipment.json</b>, ảnh đặt vào <b>src/assets/equipment/</b>
        đúng tên trường <b>image</b> — trang tự nhận.</li>
    </ul>
  </section>
</template>

<style scoped>
.grid{
  list-style:none;margin:0;padding:0;display:grid;gap:12px;
  grid-template-columns:repeat(auto-fill,minmax(148px,1fr));
}
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

.sk{
  position:absolute;right:7px;top:7px;padding:1px 7px;border-radius:999px;
  font-size:10px;font-weight:800;color:#FFF8E7;
  background:#8A5A2B;border:1px solid rgba(0,0,0,.25);
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
}
</style>
