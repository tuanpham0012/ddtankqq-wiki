<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import data from '../data/formations.json'

const current = ref(data.formations[0].key)
const formation = computed(() => data.formations.find((f) => f.key === current.value))

// Đếm số mốc để hiện cạnh tên nhóm
const countOf = (f, key) => f[key].reduce((n, r) => n + r.tiers.length, 0)
</script>

<template>
  <SiteHeader
    title="Trận hình thú cưng"
    subtitle="Điều kiện kích hoạt thuộc tính"
    subtitle-zh="宠物阵法：属性激活"
  />

  <section class="panel picker">
    <button v-for="f in data.formations" :key="f.key" type="button"
            class="fchip" :class="{ on: current === f.key }"
            :style="{ '--c': f.color }" @click="current = f.key">
      <span class="fi" aria-hidden="true">{{ f.icon }}</span>
      <span class="ft">
        <span class="fv">{{ f.nameVi }}</span>
        <span class="fz">{{ f.nameZh }}</span>
      </span>
    </button>
  </section>

  <div class="cols" :style="{ '--c': formation.color }">
    <section v-for="s in data.sections" :key="s.key" class="panel col">
      <h2>
        {{ s.labelVi }}<small>{{ s.labelZh }}</small>
        <span class="n">{{ countOf(formation, s.key) }} mốc</span>
      </h2>
      <p class="hint-note">{{ s.note }}</p>

      <ul class="reqs">
        <li v-for="(r, i) in formation[s.key]" :key="i" class="req">
          <p class="rq">
            {{ r.reqVi }}
            <span class="zh">{{ r.reqZh }}</span>
          </p>
          <ul class="tiers">
            <li v-for="(t, ti) in r.tiers" :key="ti">
              <span class="need">{{ t.needVi }}</span>
              <span class="arrow" aria-hidden="true">→</span>
              <b class="reward">{{ t.rewardVi }}</b>
              <span class="zh">{{ t.needZh }}：{{ t.rewardZh }}</span>
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </div>

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Mọi phần thưởng ở đây đều cộng cho <b>pet xuất trận</b> (出战宠物), không phải cho cả đội hình.</li>
      <li>Nhóm <b>Thuộc tính pet</b> tính theo chỉ số và cấp của chính các pet trong trận; nhóm <b>Trang bị pet</b>
        tính theo tổng chỉ số trang bị mà các pet trong trận đang mang.</li>
      <li>Số lần kích hoạt tối đa khác nhau: nhóm thuộc tính <b>x/1</b>, nhóm trang bị <b>x/9</b>.</li>
      <li>Bảng chỉ ghi <b>mốc yêu cầu</b>. Tiến độ kiểu <i>(513/1020)</i> trong game là của riêng từng tài khoản nên không đưa vào đây.</li>
      <li>Danh sách trang bị trong game còn cuộn được, có thể còn mốc chưa chụp tới — bổ sung vào
        <b>src/data/formations.json</b> là trang tự cập nhật.</li>
    </ul>
  </section>
</template>

<style scoped>
.picker{display:flex;flex-wrap:wrap;gap:10px}
.fchip{
  flex:1 1 160px;display:flex;align-items:center;gap:9px;cursor:pointer;text-align:left;
  font:inherit;color:var(--wood);padding:8px 12px;border-radius:12px;
  background:#EBD6A8;border:2px solid #CFAF79;
  transition:transform .08s ease, background .12s ease, border-color .12s ease;
}
.fchip:hover{transform:translateY(-1px);background:#F3E2BC}
.fchip.on{
  background:linear-gradient(180deg,color-mix(in srgb, var(--c) 78%, #FBF1D8), var(--c));
  border-color:#35190C;color:#FFF8E7;box-shadow:0 3px 0 #35190C;
}
.fi{
  display:grid;place-items:center;flex:none;width:32px;height:32px;border-radius:9px;
  background:#FBF1D8;border:1px solid #CFAF79;font-size:17px;
}
.ft{display:flex;flex-direction:column;line-height:1.15;min-width:0}
.fv{font-family:"Baloo 2",cursive;font-weight:800;font-size:14px}
.fz{font-size:11px;opacity:.8}

.cols{display:grid;gap:16px;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));margin-top:16px}
.col{border-top:6px solid var(--c)}
.col h2{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}
.col h2 small{font-size:11.5px;font-weight:500;color:var(--ink-soft)}
.col h2 .n{
  margin-left:auto;font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;
  background:#EBD6A8;color:var(--ink-soft);
}
.hint-note{margin:0 0 12px;font-size:11.5px;color:var(--ink-soft)}

.reqs{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.req{
  padding:10px 12px;border-radius:12px;
  background:#FFF8E7;border:2px solid #E4D0A6;
}
.rq{margin:0;font-size:13px;font-weight:700;line-height:1.4;color:var(--wood)}
.rq .zh{display:block;font-size:11px;font-weight:500;color:var(--ink-soft)}

.tiers{list-style:none;margin:8px 0 0;padding:8px 0 0;display:flex;flex-direction:column;gap:8px;
  border-top:1px dashed #D9BE8E}
.tiers li{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px;font-size:12.5px}
.need{color:var(--ink)}
.arrow{color:var(--c);font-weight:800}
.reward{
  color:#2E7D32;background:#EAF5E6;border:1px solid #BFD9B4;
  padding:1px 8px;border-radius:999px;font-size:12px;
}
.tiers .zh{width:100%;font-size:11px;color:var(--ink-soft)}

.notes{margin-top:18px}
</style>
