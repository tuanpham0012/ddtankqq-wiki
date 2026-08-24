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
        <!-- Khối mô phỏng bảng vũ khí trong game: nền tối, viền vàng, các mốc mở khoá xếp dọc -->
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="item.nameVi">
          <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>

          <header class="top">
            <img v-if="image" class="ico" :src="image" :alt="item.nameVi" />
            <div v-else class="ico ico-none" aria-hidden="true">?</div>
            <div class="id">
              <p class="name">{{ item.nameVi }}<span class="zh">{{ item.nameZh }}</span></p>
              <p class="tags">
                <span v-if="item.typeVi" class="tag">{{ item.typeVi }}<i>{{ item.typeZh }}</i></span>
                <span v-if="item.plus" class="tag hot">{{ item.plus }}<i v-if="item.plusMax">{{ item.plusMax }}</i></span>
                <span v-if="item.ex" class="tag ex">EX</span>
                <span v-if="item.angle" class="tag">Góc bắn {{ item.angle }}<i>角度</i></span>
                <span v-if="item.enhanceLv" class="tag">Cường hoá {{ item.enhanceLv }}<i>强化等级</i></span>
              </p>
            </div>
          </header>

          <h3 class="ttl">Chỉ số<span class="zh">属性 · {{ item.enhanceLv }}</span></h3>
          <ul class="stats">
            <li v-for="(s, i) in item.stats" :key="i">
              <span class="sl">{{ s.labelVi }}<small>{{ s.labelZh }}</small></span>
              <b class="sv">{{ s.value }}</b>
            </li>
          </ul>

          <template v-for="(grp, gi) in [
            { key: 'unlocks', ttlVi: 'Mốc mở khoá theo cấp', ttlZh: '解锁' },
            { key: 'breakthroughs', ttlVi: 'Mốc đột phá', ttlZh: '突破等级解锁' },
          ]" :key="gi">
            <template v-if="item[grp.key]?.length">
              <h3 class="ttl">{{ grp.ttlVi }}<span class="zh">{{ grp.ttlZh }}</span></h3>
              <section v-for="(u, ui) in item[grp.key]" :key="ui" class="tier">
                <p class="lv">
                  {{ u.labelVi }}<span class="zh">{{ u.labelZh }}</span>
                  <b v-if="u.unlocked" class="on">đã mở<i>已解锁</i></b>
                </p>
                <ul class="eff">
                  <li v-for="(e, i) in u.effects" :key="i">
                    <p :class="{ pve: e.pve }">{{ e.vi }}</p>
                    <p class="zh">{{ e.zh }}</p>
                    <ul v-if="e.subs?.length" class="subs">
                      <li v-for="(s, j) in e.subs" :key="j">
                        <p class="sn">{{ s.nameVi }}<i>{{ s.nameZh }}</i></p>
                        <p>{{ s.vi }}</p>
                        <p class="zh">{{ s.zh }}</p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </section>
            </template>
          </template>

          <p v-if="item.flavorVi" class="flavor">
            {{ item.flavorVi }}<span class="zh">{{ item.flavorZh }}</span>
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
  position:relative;width:min(640px,100%);max-height:88vh;overflow:auto;
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
  margin:0 0 6px;font-family:"Baloo 2",cursive;font-weight:800;font-size:19px;color:#F7D477;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.zh{font-family:inherit;font-weight:500;font-size:12px;color:#A9946F}

.tags{margin:0;display:flex;flex-wrap:wrap;gap:6px}
.tag{
  display:inline-flex;align-items:baseline;gap:5px;
  padding:2px 9px;border-radius:999px;background:rgba(0,0,0,.28);
  font-size:11.5px;color:#C9B48C;
}
.tag i{font-style:normal;font-size:10.5px;color:#8F7B5E}
.tag.hot{color:#7ED957;font-weight:700}
.tag.ex{color:#F0C24B;font-weight:800}

.ttl{
  margin:16px 0 8px;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px;color:#7ED957;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.ttl .zh{color:#8F7B5E}

.stats{
  list-style:none;margin:0;padding:10px 12px;display:grid;gap:8px;
  grid-template-columns:repeat(auto-fit,minmax(170px,1fr));
  background:rgba(0,0,0,.2);border-radius:10px;
}
.stats li{display:flex;align-items:baseline;gap:8px}
.sl{display:flex;flex-direction:column;line-height:1.15;font-size:12.5px}
.sl small{font-size:10.5px;color:#8F7B5E}
.sv{margin-left:auto;font-size:14px;font-weight:800;color:#F7D477}

.tier{margin-bottom:10px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.2)}
.lv{
  margin:0 0 7px;font-size:12.5px;font-weight:800;color:#F0C24B;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.lv .on{
  margin-left:auto;display:inline-flex;align-items:baseline;gap:5px;
  padding:1px 8px;border-radius:999px;background:rgba(126,217,87,.16);
  font-size:10.5px;font-weight:700;color:#7ED957;
}
.lv .on i{font-style:normal;font-weight:500;color:#6F8F5E}

.eff{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px}
.eff > li{padding-left:14px;position:relative;font-size:12.5px;line-height:1.6}
.eff > li::before{content:"◆";position:absolute;left:0;top:0;font-size:9px;color:#C98A3A}
.eff p{margin:0}
.eff .zh{margin-top:2px;color:#A9946F;font-size:11.5px;line-height:1.5}
.eff .pve{color:#9FD8E6}

.subs{list-style:none;margin:7px 0 0;padding:0;display:flex;flex-direction:column;gap:7px}
.subs li{padding:7px 10px;border-radius:8px;background:rgba(0,0,0,.26);border-left:3px solid #C98A3A}
.sn{font-size:12px;font-weight:800;color:#F0C24B}
.sn i{margin-left:6px;font-style:normal;font-size:10.5px;font-weight:500;color:#8F7B5E}

.flavor{
  margin:14px 0 0;padding:9px 12px;border-radius:10px;background:rgba(0,0,0,.2);
  font-size:12px;line-height:1.6;color:#C9B48C;
}
.flavor .zh{display:block;margin-top:2px}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}
</style>
