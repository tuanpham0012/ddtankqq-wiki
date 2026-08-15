<script setup>
import { ref, watch } from 'vue'
import SiteNav from './components/SiteNav.vue'

// Nhớ trạng thái ẩn/hiện menu giữa các lần mở trang
const STORE_KEY = 'ddtank-wiki:nav-open'
const open = ref(localStorage.getItem(STORE_KEY) !== '0')
watch(open, (v) => localStorage.setItem(STORE_KEY, v ? '1' : '0'))
</script>

<template>
  <div class="wrap layout" :class="{ 'is-closed': !open }">
    <aside class="sidebar">
      <button type="button" class="toggle" :aria-expanded="open" aria-controls="site-nav"
              :title="open ? 'Ẩn menu' : 'Hiện menu'" @click="open = !open">
        <span class="bars" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>
        <span class="label">{{ open ? 'Ẩn menu' : 'Menu' }}</span>
      </button>

      <Transition name="nav">
        <SiteNav v-show="open" id="site-nav" />
      </Transition>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout{
  display:grid;grid-template-columns:232px minmax(0,1fr);gap:22px;align-items:start;
}
/* Menu ẩn: cột trái co lại chỉ còn bề ngang cái nút */
.layout.is-closed{grid-template-columns:auto minmax(0,1fr)}

.sidebar{position:sticky;top:22px}

.toggle{
  display:flex;align-items:center;gap:8px;margin:0 0 10px;padding:7px 12px;
  font:inherit;font-weight:700;font-size:12.5px;color:var(--wood);cursor:pointer;
  background:linear-gradient(180deg,#FBF1D8,#EFD8A8);
  border:2px solid #8A5A2B;border-radius:11px;
  box-shadow:0 3px 0 #6B3D20,0 6px 14px rgba(0,0,0,.25);
  transition:transform .08s ease, box-shadow .08s ease;
}
.toggle:hover{transform:translateY(-1px);box-shadow:0 4px 0 #6B3D20,0 8px 18px rgba(0,0,0,.3)}
.toggle:active{transform:translateY(2px);box-shadow:0 1px 0 #6B3D20,0 3px 8px rgba(0,0,0,.25)}
.toggle:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
/* Menu ẩn: chỉ còn icon, nút thành ô vuông */
.is-closed .toggle{padding:8px 9px}
.is-closed .toggle .label{display:none}

.bars{display:grid;gap:3px;flex:none}
.bars i{display:block;width:15px;height:2px;border-radius:2px;background:var(--wood)}

/* Trượt nhẹ khi ẩn/hiện */
.nav-enter-active,.nav-leave-active{transition:opacity .16s ease, transform .16s ease}
.nav-enter-from,.nav-leave-to{opacity:0;transform:translateX(-10px)}

@media (max-width:760px){
  .layout,.layout.is-closed{grid-template-columns:minmax(0,1fr);gap:0}
  .sidebar{position:static;margin-bottom:16px}
  .toggle{margin-bottom:10px}
  .nav-enter-from,.nav-leave-to{transform:translateY(-8px)}
}
</style>
