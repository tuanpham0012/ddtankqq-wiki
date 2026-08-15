<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import SkillEffects from './SkillEffects.vue'

const props = defineProps({
  pet: { type: Object, default: null },      // pet trong pets.json + trường details
  image: { type: String, default: '' },
})
const emit = defineEmits(['close'])

// Kỹ năng nào đang mở (theo index), mặc định mở cái đầu
const active = ref(0)
watch(() => props.pet, () => { active.value = 0 })

const onKey = (e) => { if (e.key === 'Escape') emit('close') }

watch(
  () => props.pet,
  (p) => {
    if (p) {
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
      <div v-if="pet" class="mask" @click.self="emit('close')">
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="`Thông tin ${pet.nameVi}`">
          <div class="bar">
            <h2>Thông tin thú cưng<small>宠物信息</small></h2>
            <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>
          </div>

          <div class="scroll">
            <div class="top">
              <div class="portrait">
                <img v-if="image" :src="image" :alt="pet.nameVi" />
                <span v-else class="ph" aria-hidden="true">{{ pet.nameZh.slice(0, 1) }}</span>
              </div>

              <div class="ident">
                <p class="name">
                  {{ pet.nameVi }}
                  <span class="zh">{{ pet.nameZh }}</span>
                  <span class="rank" :class="`r-${pet.rank}`">{{ pet.rank === 'ex' ? 'EX' : 'S' }}</span>
                  <span v-if="pet.limited" class="lim">Tuyệt bản</span>
                </p>
                <p v-if="pet.details.quoteVi" class="quote">
                  “{{ pet.details.quoteVi }}”
                  <span class="qzh">{{ pet.details.quoteZh }}</span>
                </p>
                <p v-if="pet.details.sourceVi" class="src">
                  <b>Nguồn</b> {{ pet.details.sourceVi }}
                  <span class="zh">产出：{{ pet.details.sourceZh }}</span>
                </p>
              </div>
            </div>

            <ul v-if="pet.details.stats?.length" class="stats">
              <li v-for="s in pet.details.stats" :key="s.key">
                <span class="si" aria-hidden="true">{{ s.icon }}</span>
                <span class="sl">{{ s.labelVi }}<small>{{ s.labelZh }}</small></span>
                <b class="sv">{{ s.value }}</b>
              </li>
            </ul>

            <div v-if="pet.details.skills?.length" class="skills">
              <div class="tabs" role="tablist">
                <button v-for="(sk, i) in pet.details.skills" :key="i" type="button" role="tab"
                        class="tab" :class="[`t-${sk.type}`, { on: active === i }]"
                        :aria-selected="active === i" @click="active = i">
                  <span class="tt">{{ sk.typeVi }}</span>
                  {{ sk.nameVi }}
                </button>
              </div>

              <article v-for="(sk, i) in pet.details.skills" v-show="active === i" :key="i" class="skill">
                <header class="sk-head">
                  <h3>
                    {{ sk.nameVi }}
                    <span class="zh">{{ sk.nameZh }}</span>
                  </h3>
                  <span v-if="sk.level" class="lv">{{ sk.level }}</span>
                </header>

                <ul v-if="sk.meta?.length" class="meta">
                  <li><span class="mk">Loại</span><b>{{ sk.typeVi }}</b><small>{{ sk.typeZh }}</small></li>
                  <li v-for="m in sk.meta" :key="m.labelZh">
                    <span class="mk">{{ m.labelVi }}</span><b>{{ m.value }}</b><small>{{ m.labelZh }}</small>
                  </li>
                </ul>

                <SkillEffects :items="sk.effects" />
              </article>
            </div>

            <p v-if="pet.dishes?.length" class="likes">
              <b>Thích ăn:</b>
              <RouterLink v-for="d in pet.dishes" :key="d.id" class="dish"
                          :to="{ name: 'bep-ma-phap', hash: `#${d.id}` }" @click="emit('close')">
                {{ d.nameVi }}
              </RouterLink>
            </p>
          </div>
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
  width:min(720px,100%);max-height:88vh;display:flex;flex-direction:column;
  background:#FBF1D8;border:3px solid #8A5A2B;border-radius:18px;
  box-shadow:0 10px 0 #6B3D20,0 22px 44px rgba(0,0,0,.45);
}

.bar{
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  padding:10px 12px 11px;border-bottom:3px solid #8A5A2B;border-radius:15px 15px 0 0;
  background:linear-gradient(180deg,#8A5A2B,#5E3418);
}
.bar h2{margin:0;font-family:"Baloo 2",cursive;font-weight:800;font-size:17px;color:#FBF1D8}
.bar h2 small{display:block;font-size:11px;font-weight:500;opacity:.75}
.x{
  flex:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font:inherit;font-size:14px;
  background:linear-gradient(180deg,#E0563B,#B03A23);color:#fff;
  border:2px solid #FBF1D8;box-shadow:0 2px 0 #7A2A0E;
}
.x:hover{filter:brightness(1.08)}
.x:active{transform:translateY(2px);box-shadow:none}

.scroll{overflow:auto;padding:14px 16px 16px}

.top{display:flex;gap:14px;align-items:flex-start}
.portrait{
  flex:none;width:132px;border-radius:12px;overflow:hidden;
  border:2px solid #C9A96E;background:#EBD6A8;
}
.portrait img{display:block;width:100%;height:100%;object-fit:cover}
.portrait .ph{display:grid;place-items:center;height:100px;font-size:30px;color:#9B7B4A}

.ident{min-width:0;flex:1}
.name{
  margin:0 0 6px;font-family:"Baloo 2",cursive;font-weight:800;font-size:19px;color:var(--wood);
  display:flex;flex-wrap:wrap;align-items:center;gap:7px;
}
.name .zh{font-family:inherit;font-size:13px;font-weight:500;color:var(--ink-soft)}
.rank{
  font-size:11px;padding:1px 8px;border-radius:999px;color:#fff;
  background:linear-gradient(180deg,#E4B23A,#B8862B);
}
.rank.r-ex{background:linear-gradient(180deg,#D9553C,#9A3714)}
.lim{font-size:10.5px;padding:1px 7px;border-radius:6px;background:#B8482B;color:#fff}
.quote{margin:0 0 6px;font-size:13px;line-height:1.5;color:#8A5A2B;font-style:italic}
.quote .qzh{display:block;font-style:normal;font-size:11.5px;color:var(--ink-soft)}
.src{margin:0;font-size:12.5px;color:var(--ink)}
.src b{color:var(--gold);margin-right:4px}
.src .zh{margin-left:6px;font-size:11.5px;color:var(--ink-soft)}

.stats{
  list-style:none;margin:14px 0 0;padding:12px;display:grid;gap:10px;
  grid-template-columns:repeat(auto-fit,minmax(150px,1fr));
  background:#FFF8E7;border:2px solid #E4D0A6;border-radius:13px;
}
.stats li{display:flex;align-items:center;gap:8px}
.si{font-size:16px}
.sl{display:flex;flex-direction:column;line-height:1.1;font-size:12.5px;font-weight:700;color:var(--ink)}
.sl small{font-size:10.5px;font-weight:500;color:var(--ink-soft)}
.sv{margin-left:auto;font-size:16px;font-weight:800;color:#2E7D32}

.skills{margin-top:14px}
.tabs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px}
.tab{
  display:flex;flex-direction:column;align-items:flex-start;gap:1px;cursor:pointer;
  font:inherit;font-size:13px;font-weight:700;color:var(--wood);text-align:left;
  padding:6px 12px;border-radius:11px;
  background:#EBD6A8;border:2px solid #CFAF79;
}
.tab .tt{font-size:10px;font-weight:700;opacity:.8}
.tab.on{background:linear-gradient(180deg,var(--wood-2),var(--wood));border-color:#35190C;color:#FBF1D8}
.tab.t-passive .tt{color:#1E7F94}
.tab.t-passive.on .tt{color:#9FD8E6}

/* Khối kỹ năng mô phỏng tooltip nền tối trong game */
.skill{
  padding:12px 14px;border-radius:13px;
  background:linear-gradient(180deg,#4A3628,#3A2A1E);
  border:2px solid #2A1D14;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);
  color:#F3E3C4;
}
.sk-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap}
.sk-head h3{margin:0;font-family:"Baloo 2",cursive;font-weight:800;font-size:16px;color:#F7D477}
.sk-head h3 .zh{font-family:inherit;font-size:12px;font-weight:500;color:#C9B48C;margin-left:6px}
.lv{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:#6B3D20;color:#F3E3C4}

.meta{
  list-style:none;margin:10px 0 0;padding:8px 10px;display:grid;gap:6px;
  grid-template-columns:repeat(auto-fit,minmax(122px,1fr));
  background:rgba(0,0,0,.18);border-radius:9px;
}
.meta li{display:flex;align-items:baseline;gap:5px;font-size:12px}
.mk{color:#C9B48C}
.meta b{color:#F7D477}
.meta small{font-size:10px;color:#8F7B5E}

.likes{margin:14px 0 0;display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:12.5px}
.likes b{color:var(--ink-soft);font-size:11.5px}
.dish{
  font-size:11.5px;text-decoration:none;color:var(--ink);
  padding:2px 8px;border-radius:999px;background:#E7D3A5;border:1px solid #C9A96E;
}
.dish:hover{background:#F3E2BC}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}

@media (max-width:560px){
  .top{flex-direction:column;align-items:center;text-align:center}
  .portrait{width:100%;max-width:220px}
  .name{justify-content:center}
}
</style>
