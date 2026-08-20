<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  image: { type: String, default: '' },
  types: { type: Array, default: () => [] },
})
const emit = defineEmits(['close'])

// Mỗi hệ hồn thể một màu, giống viền bảng trong game
const TYPE_COLORS = {
  'trat-tu': ['#F0C24B', '#C08A18'],
  'hu-vo': ['#A96BE0', '#7239AE'],
  'sieu-nhien': ['#4FC3F7', '#1E7FC2'],
}
const tone = computed(() => TYPE_COLORS[props.item?.type] || ['#5FBF48', '#3E8F30'])
const typeLabel = computed(() => props.types.find((t) => t.key === props.item?.type) || {})

const onKey = (e) => { if (e.key === 'Escape') emit('close') }
watch(
  () => props.item,
  (v) => {
    if (v) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  },
)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="pop">
      <div v-if="item" class="mask" @click.self="emit('close')">
        <!-- Khối mô phỏng bảng hồn thể trong game: nền tối, viền theo hệ -->
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="item.nameVi"
             :style="{ '--c1': tone[0], '--c2': tone[1] }">
          <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>

          <header class="top">
            <img v-if="image" class="ico" :src="image" :alt="item.nameVi" />
            <div v-else class="ico ico-none" aria-hidden="true">?</div>
            <div class="id">
              <p class="name">{{ item.nameVi }}<span class="zh">{{ item.nameZh }}</span></p>
              <p class="tags">
                <span class="tag">Hệ: <b>{{ typeLabel.labelVi }}</b><i>{{ typeLabel.labelZh }}</i></span>
                <span class="tag" :class="item.tradable ? 'ok' : 'no'">
                  {{ item.tradable ? 'Giao dịch được' : 'Không giao dịch' }}
                  <i>{{ item.tradable ? '可交易' : '不可交易' }}</i>
                </span>
              </p>
            </div>
          </header>

          <h3 class="ttl">Thuộc tính<span class="zh">属性</span></h3>
          <ul class="stats">
            <li v-for="(s, i) in item.stats" :key="i">
              <span class="sl">{{ s.labelVi }}<small>{{ s.labelZh }}</small></span>
              <b class="sv">{{ s.value }}</b>
            </li>
          </ul>

          <template v-if="item.affixes?.length">
            <h3 class="ttl">Từ điều<span class="zh">词条</span></h3>
            <ul class="affixes">
              <li v-for="(a, i) in item.affixes" :key="i">
                <p class="an">「{{ a.nameVi }}」<i>{{ a.nameZh }}</i></p>
                <p class="ad">{{ a.descVi }}</p>
                <p class="ad zh">{{ a.descZh }}</p>
              </li>
            </ul>
          </template>

          <section v-if="item.skill" class="skill">
            <h3 class="ttl skl">{{ item.skill.nameVi }}<span class="zh">{{ item.skill.nameZh }}</span></h3>
            <ul class="meta">
              <li v-for="(m, i) in item.skill.meta" :key="i">
                <span class="sl">{{ m.labelVi }}<small>{{ m.labelZh }}</small></span>
                <b class="sv">{{ m.value }}<i v-if="m.valueZh">{{ m.valueZh }}</i></b>
              </li>
            </ul>

            <p class="lead">{{ item.skill.leadVi }}</p>
            <p class="lead zh">{{ item.skill.leadZh }}</p>
            <ol class="eff">
              <li v-for="(e, i) in item.skill.effectsVi" :key="i">
                <p>{{ e }}</p>
                <p class="zh">{{ item.skill.effectsZh?.[i] }}</p>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.mask{
  position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:20px 14px;
  background:rgba(28,14,6,.62);backdrop-filter:blur(2px);
}
.dlg{
  position:relative;width:min(560px,100%);max-height:88vh;overflow:auto;
  padding:16px 18px 18px;border-radius:16px;color:#F3E3C4;
  background:linear-gradient(180deg,#4A3628,#3A2A1E);
  border:3px solid var(--c1,#7ED957);
  box-shadow:0 10px 0 rgba(0,0,0,.35),0 22px 44px rgba(0,0,0,.5);
}
.x{
  position:absolute;right:10px;top:10px;width:28px;height:28px;border-radius:50%;cursor:pointer;
  font:inherit;font-size:13px;background:linear-gradient(180deg,#E0563B,#B03A23);color:#fff;
  border:2px solid #F3E3C4;
}
.x:hover{filter:brightness(1.1)}

.top{display:flex;gap:13px;align-items:flex-start;padding-right:32px}
.ico{
  flex:none;width:78px;height:78px;border-radius:12px;object-fit:cover;
  border:2px solid #7A6047;background:#2A1D14;
}
.ico-none{display:grid;place-items:center;font-size:26px;color:#6B5340}
.id{min-width:0}
.name{
  margin:0 0 6px;font-family:"Baloo 2",cursive;font-weight:800;font-size:18px;color:#F7D477;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.zh{font-family:inherit;font-weight:500;font-size:12px;color:#A9946F}

.tags{margin:0;display:flex;flex-wrap:wrap;gap:6px}
.tag{
  display:inline-flex;align-items:baseline;gap:5px;
  padding:2px 9px;border-radius:999px;background:rgba(0,0,0,.28);
  font-size:11.5px;color:#C9B48C;
}
.tag b{color:#F7D477}
.tag i{font-style:normal;color:#8F7B5E}
.tag.ok{color:#B7E6A2}
.tag.no{color:#E9A48C}

.ttl{
  margin:14px 0 7px;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px;color:var(--c1,#7ED957);
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.ttl .zh{color:#8F7B5E}

.stats,.meta{
  list-style:none;margin:0;padding:10px 12px;display:grid;gap:8px;
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
  background:rgba(0,0,0,.2);border-radius:10px;
}
.stats li,.meta li{display:flex;align-items:baseline;gap:8px}
.sl{display:flex;flex-direction:column;line-height:1.15;font-size:12.5px}
.sl small{font-size:10.5px;color:#8F7B5E}
.sv{margin-left:auto;font-size:14px;font-weight:800;color:#F7D477;display:flex;align-items:baseline;gap:5px}
.sv i{font-style:normal;font-size:10.5px;font-weight:500;color:#8F7B5E}

.affixes{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
.affixes .an{margin:0;font-size:12.5px;font-weight:700;color:#F0C24B}
.affixes .an i{margin-left:6px;font-style:normal;font-size:11px;font-weight:500;color:#8F7B5E}
.affixes .ad{margin:2px 0 0;font-size:12.5px;line-height:1.6}
.affixes .ad.zh{color:#A9946F;font-size:11.5px;line-height:1.5}

.skill{margin-top:14px;padding-top:12px;border-top:1px solid #6B5340}
.lead{margin:11px 0 0;font-size:13px;line-height:1.6}
.lead.zh{margin-top:3px;color:#A9946F;font-size:11.5px;line-height:1.5}
.eff{margin:7px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.eff li{font-size:12.5px;line-height:1.6}
.eff p{margin:0}
.eff .zh{margin-top:2px;color:#A9946F;font-size:11.5px;line-height:1.5}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}
</style>
