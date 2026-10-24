<script setup>
import { onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  item: { type: Object, default: null },
  set: { type: Object, default: null },
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
        <div class="dlg" role="dialog" aria-modal="true" :aria-label="item.nameVi">
          <button type="button" class="x" title="Đóng (Esc)" @click="emit('close')">✕</button>

          <header class="top">
            <img v-if="image" class="ico" :src="image" :alt="item.nameVi" />
            <div v-else class="ico ico-none" aria-hidden="true">?</div>
            <div>
              <p class="name">{{ item.nameVi }}<span class="zh">{{ item.nameZh }}</span></p>
              <p class="tags">
                <span class="tag legend">{{ item.rarityVi }}<i>{{ item.rarityZh }}</i></span>
                <span class="tag">{{ item.slotVi }}<i>{{ item.slotZh }}</i></span>
              </p>
            </div>
          </header>

          <template v-if="item.legendVi">
            <h3 class="ttl">Thuộc tính truyền thuyết<span class="zh">传说属性</span></h3>
            <p class="legend-attr">{{ item.legendVi }}<span class="zh">{{ item.legendZh }}</span></p>
          </template>

          <template v-if="set">
            <h3 class="ttl">Hiệu quả bộ {{ set.nameVi }}<span class="zh">{{ set.nameZh }}</span></h3>
            <section v-for="b in set.bonuses" :key="b.count" class="tier">
              <p class="lv">({{ b.count }}/{{ set.total }}) Hiệu quả bộ<span class="zh">套装效果</span></p>
              <ol class="eff">
                <li v-for="(e, i) in b.effects" :key="i">
                  <p>{{ e.vi }}</p>
                  <p class="zh">{{ e.zh }}</p>
                </li>
              </ol>
            </section>
          </template>
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
  position:relative;width:min(600px,100%);max-height:88vh;overflow:auto;
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
  flex:none;width:72px;height:72px;border-radius:12px;object-fit:cover;
  border:2px solid #7A6047;background:#2A1D14;
}
.ico-none{display:grid;place-items:center;font-size:26px;color:#6B5340}
.name{
  margin:0 0 6px;font-family:"Baloo 2",cursive;font-weight:800;font-size:19px;color:#F7D477;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.zh{font-family:inherit;font-weight:500;font-size:11.5px;color:#A9946F}

.tags{margin:0;display:flex;flex-wrap:wrap;gap:6px}
.tag{
  display:inline-flex;align-items:baseline;gap:5px;padding:2px 9px;border-radius:999px;
  background:rgba(0,0,0,.28);font-size:11.5px;color:#C9B48C;
}
.tag i{font-style:normal;font-size:10.5px;color:#8F7B5E}
.tag.legend{color:#F0C24B;font-weight:800}

.ttl{
  margin:16px 0 8px;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px;color:#7ED957;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.ttl .zh{color:#8F7B5E}

.legend-attr{
  margin:0;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.2);
  font-size:13px;font-weight:700;color:#FF6B57;
}
.legend-attr .zh{display:block;margin-top:2px}

.tier{margin-bottom:10px;padding:10px 12px;border-radius:10px;background:rgba(0,0,0,.2)}
.lv{
  margin:0 0 7px;font-size:12.5px;font-weight:800;color:#F0C24B;
  display:flex;flex-wrap:wrap;align-items:baseline;gap:7px;
}
.eff{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:7px}
.eff li{font-size:12.5px;line-height:1.55}
.eff li::marker{color:#C98A3A;font-weight:800}
.eff p{margin:0}
.eff .zh{margin-top:1px;font-size:11px;line-height:1.5}

.pop-enter-active,.pop-leave-active{transition:opacity .16s ease}
.pop-enter-active .dlg,.pop-leave-active .dlg{transition:transform .16s ease}
.pop-enter-from,.pop-leave-to{opacity:0}
.pop-enter-from .dlg,.pop-leave-to .dlg{transform:translateY(12px) scale(.97)}
</style>
