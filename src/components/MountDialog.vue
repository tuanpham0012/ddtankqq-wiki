<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  image: { type: String, default: '' },
})
const emit = defineEmits(['close'])

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
        <!-- Khối mô phỏng bảng thú cưỡi trong game: nền tối, viền vàng -->
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="item.nameVi">
          <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>

          <header class="top">
            <img v-if="image" class="ico" :src="image" :alt="item.nameVi" />
            <div v-else class="ico ico-none" aria-hidden="true">?</div>
            <div class="id">
              <p class="name">{{ item.nameVi }}<span class="zh">{{ item.nameZh }}</span></p>
              <p v-if="item.taglineVi" class="tag">{{ item.taglineVi }}</p>
              <p v-if="item.taglineZh" class="tag zh">{{ item.taglineZh }}</p>
            </div>
          </header>

          <h3 class="ttl">Chỉ số gốc<span class="zh">属性 · LV.0</span></h3>
          <ul class="stats">
            <li v-for="(s, i) in item.stats" :key="i">
              <span class="sl">{{ s.labelVi }}<small>{{ s.labelZh }}</small></span>
              <b class="sv">{{ s.value }}</b>
            </li>
          </ul>

          <template v-if="item.unlocks?.length">
            <h3 class="ttl">Mốc mở khoá<span class="zh">解锁</span></h3>
            <ul class="unlocks">
              <li v-for="(u, i) in item.unlocks" :key="i">
                <span class="ul-vi">{{ u.labelVi }}</span>
                <span class="ul-zh">{{ u.labelZh }}</span>
                <b v-if="u.progress" class="ul-p">{{ u.progress }}</b>
              </li>
            </ul>
          </template>

          <section v-for="(sk, si) in item.skills" :key="si" class="skill">
            <h3 class="ttl skl">
              {{ sk.nameVi }}<span class="zh">{{ sk.nameZh }}</span>
              <span v-if="sk.kindVi" class="kind">{{ sk.kindVi }}<i>{{ sk.kindZh }}</i></span>
            </h3>

            <ul v-if="sk.meta?.length" class="meta">
              <li v-for="(m, i) in sk.meta" :key="i">
                <span class="sl">{{ m.labelVi }}<small>{{ m.labelZh }}</small></span>
                <b class="sv">{{ m.value }}<i v-if="m.valueZh">{{ m.valueZh }}</i></b>
              </li>
            </ul>

            <div v-for="(t, ti) in sk.tiers" :key="ti" class="tier" :class="{ next: ti > 0 }">
              <p class="lv">{{ t.labelVi }}<span class="zh">{{ t.labelZh }}</span></p>

              <template v-if="t.leadVi">
                <p class="lead">{{ t.leadVi }}</p>
                <p class="lead zh">{{ t.leadZh }}</p>
              </template>

              <ol class="eff">
                <li v-for="(e, i) in t.effectsVi" :key="i">
                  <p>{{ e }}</p>
                  <p class="zh">{{ t.effectsZh?.[i] }}</p>
                </li>
              </ol>

              <template v-if="t.pveVi?.length">
                <p class="pve-h">Hiệu lực trong PVE<span class="zh">PVE生效</span></p>
                <ol class="eff pve">
                  <li v-for="(e, i) in t.pveVi" :key="i">
                    <p>{{ e }}</p>
                    <p class="zh">{{ t.pveZh?.[i] }}</p>
                  </li>
                </ol>
              </template>
            </div>
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
  position:relative;width:min(620px,100%);max-height:88vh;overflow:auto;
  padding:16px 18px 18px;border-radius:16px;color:#F3E3C4;
  background:linear-gradient(180deg,#4A3628,#3A2A1E);
  border:3px solid #C98A3A;
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
  flex:none;width:86px;height:86px;border-radius:12px;object-fit:cover;
  border:2px solid #7A6047;background:#2A1D14;
}
.ico-none{display:grid;place-items:center;font-size:28px;color:#6B5340}
.id{min-width:0}
.name{
  margin:0 0 5px;font-family:"Baloo 2",cursive;font-weight:800;font-size:19px;color:#F7D477;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.zh{font-family:inherit;font-weight:500;font-size:12px;color:#A9946F}
.tag{margin:0;font-size:12.5px;line-height:1.55;color:#C9B48C}
.tag.zh{margin-top:2px;font-size:11.5px}

.ttl{
  margin:15px 0 7px;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px;color:#7ED957;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.ttl .zh{color:#8F7B5E}
.ttl.skl{color:#F0C24B}
.kind{
  margin-left:auto;display:inline-flex;align-items:baseline;gap:5px;
  padding:1px 9px;border-radius:999px;background:rgba(0,0,0,.28);
  font-family:inherit;font-size:11.5px;font-weight:700;color:#9FD8E6;
}
.kind i{font-style:normal;font-weight:500;color:#8F7B5E}

.stats,.meta{
  list-style:none;margin:0;padding:10px 12px;display:grid;gap:8px;
  grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
  background:rgba(0,0,0,.2);border-radius:10px;
}
.stats li,.meta li{display:flex;align-items:baseline;gap:8px}
.sl{display:flex;flex-direction:column;line-height:1.15;font-size:12.5px}
.sl small{font-size:10.5px;color:#8F7B5E}
.sv{margin-left:auto;font-size:14px;font-weight:800;color:#F7D477;display:flex;align-items:baseline;gap:5px}
.sv i{font-style:normal;font-size:10.5px;font-weight:500;color:#8F7B5E}

.unlocks{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
.unlocks li{
  display:flex;align-items:baseline;gap:6px;padding:4px 11px;border-radius:999px;
  background:rgba(0,0,0,.25);border:1px solid #6B5340;font-size:12px;
}
.ul-vi{font-weight:700;color:#F3E3C4}
.ul-zh{font-size:10.5px;color:#8F7B5E}
.ul-p{font-size:11px;color:#7ED957}

.skill{margin-top:16px;padding-top:12px;border-top:1px solid #6B5340}

.tier{margin-top:11px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.18)}
.tier.next{background:rgba(0,0,0,.28);border:1px dashed #6B5340}
.lv{
  margin:0 0 6px;font-size:12.5px;font-weight:800;color:#F0C24B;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.tier.next .lv{color:#9FD8E6}
.lead{margin:0 0 5px;font-size:12.5px;line-height:1.6}
.lead.zh{margin-top:-3px;color:#A9946F;font-size:11.5px}
.eff{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:8px}
.eff li{font-size:12.5px;line-height:1.6}
.eff p{margin:0}
.eff .zh{margin-top:2px;color:#A9946F;font-size:11.5px;line-height:1.5}

.pve-h{
  margin:11px 0 6px;font-size:12px;font-weight:800;color:#7ED957;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:6px;
}
.pve-h .zh{color:#8F7B5E;font-weight:500}
.eff.pve{padding-left:20px}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}
</style>
