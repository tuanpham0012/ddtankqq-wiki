<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  image: { type: String, default: '' },
})
const emit = defineEmits(['close'])

// Mỗi loại mô-đun một màu, lấy theo chữ cái Hy Lạp đầu tên như trong game
const MODULE_COLORS = {
  α: ['#F0C24B', '#C08A18'],
  β: ['#E85AA8', '#B32E77'],
  γ: ['#A96BE0', '#7239AE'],
  π: ['#4FC3F7', '#1E7FC2'],
  ψ: ['#5FBF48', '#3E8F30'],
}
const tone = computed(() => {
  const key = props.item?.detail?.moduleZh?.slice(0, 1)
  return MODULE_COLORS[key] || MODULE_COLORS['ψ']
})

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
        <!-- Khối mô phỏng tooltip mô-đun trong game: nền tối, viền sáng -->
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="item.nameVi"
             :style="{ '--c1': tone[0], '--c2': tone[1] }">
          <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>

          <header class="top">
            <img v-if="image" class="ico" :src="image" :alt="item.nameVi" />
            <div class="id">
              <p class="name">{{ item.nameVi }}<span class="zh">{{ item.nameZh }}</span></p>
              <p v-if="item.detail" class="q">
                Phẩm chất: <b>{{ item.detail.qualityVi }}</b><span class="zh">品质：{{ item.detail.qualityZh }}</span>
              </p>
              <p class="cost">
                cost值: <b>{{ item.cost }}</b>
                <span v-if="item.detail?.phase" class="phase">Đợt {{ item.detail.phase }}<i>{{ item.detail.phase }}期</i></span>
              </p>
            </div>
          </header>

          <template v-if="item.detail">
            <p v-if="item.detail.moduleVi" class="mod">
              {{ item.detail.moduleVi }}
              <span v-if="item.detail.moduleNo" class="slots">{{ item.detail.moduleNo }}</span>
              <span class="zh">{{ item.detail.moduleZh }}</span>
            </p>

            <ul v-if="item.detail.stats?.length" class="stats">
              <li v-for="(s, i) in item.detail.stats" :key="i">
                <span class="sl">{{ s.labelVi }}<small>{{ s.labelZh }}</small></span>
                <b class="sv">{{ s.value }}</b>
              </li>
            </ul>

            <section v-if="item.detail.skill" class="skill">
              <h3>{{ item.detail.skill.nameVi }}<span class="zh">{{ item.detail.skill.nameZh }}</span></h3>
              <p class="vi">{{ item.detail.skill.descVi }}</p>
              <p class="zh">{{ item.detail.skill.descZh }}</p>
            </section>
          </template>

          <p v-else class="empty">
            Chưa có dữ liệu chi tiết cho mô-đun này.<br />
            <small>Bổ sung trường <b>detail</b> cho id <b>{{ item.id }}</b> trong <b>src/data/upgrades.json</b>.</small>
          </p>
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
  position:relative;width:min(520px,100%);max-height:88vh;overflow:auto;
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
  flex:none;width:74px;height:74px;border-radius:12px;object-fit:cover;
  border:2px solid #7A6047;background:#2A1D14;
}
.id{min-width:0}
.name{
  margin:0 0 4px;font-family:"Baloo 2",cursive;font-weight:800;font-size:18px;color:#F7D477;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.zh{font-family:inherit;font-weight:500;font-size:12px;color:#A9946F}
.q,.cost{margin:0 0 3px;font-size:12.5px;color:#C9B48C;display:flex;flex-wrap:wrap;align-items:baseline;gap:6px}
.q b{color:#7ED957}
.cost b{color:#F7D477;font-size:14px}
.phase{
  display:inline-flex;align-items:baseline;gap:5px;margin-left:4px;
  padding:1px 8px;border-radius:999px;background:rgba(0,0,0,.28);
  font-size:11.5px;font-weight:700;color:#9FD8E6;
}
.phase i{font-style:normal;font-weight:500;color:#8F7B5E}

.mod{
  margin:13px 0 0;padding:6px 12px;border-radius:8px;text-align:center;
  background:linear-gradient(180deg,var(--c1,#5FBF48),var(--c2,#3E8F30));
  color:#FFF8E7;font-weight:700;font-size:13px;text-shadow:0 1px 2px rgba(0,0,0,.35);
  display:flex;justify-content:center;align-items:center;gap:8px;
}
.mod .slots{
  min-width:20px;padding:0 6px;border-radius:999px;background:rgba(0,0,0,.28);font-size:11.5px;
}
.mod .zh{color:#E4F5DC;opacity:.85}

.stats{
  list-style:none;margin:12px 0 0;padding:10px 12px;display:grid;gap:8px;
  grid-template-columns:repeat(auto-fit,minmax(190px,1fr));
  background:rgba(0,0,0,.2);border-radius:10px;
}
.stats li{display:flex;align-items:baseline;gap:8px}
.sl{display:flex;flex-direction:column;line-height:1.15;font-size:12.5px}
.sl small{font-size:10.5px;color:#8F7B5E}
.sv{margin-left:auto;font-size:14px;font-weight:800;color:#F7D477}

.skill{margin-top:12px;padding-top:11px;border-top:1px solid #6B5340}
.skill h3{margin:0 0 5px;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px;color:var(--c1,#7ED957);
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px}
.skill .vi{margin:0;font-size:13px;line-height:1.6}
.skill .zh{margin:3px 0 0;font-size:11.5px;line-height:1.5;color:#A9946F}

.empty{margin:14px 0 0;padding:12px;border-radius:10px;background:rgba(0,0,0,.2);
  font-size:12.5px;line-height:1.7;color:#C9B48C;text-align:center}
.empty small{font-size:11px;color:#8F7B5E}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}
</style>
