<script setup>
import { menu } from '../menu.js'
import site from '../data/site.json'
</script>

<template>
  <nav class="nav" aria-label="Menu chính">
    <RouterLink :to="menu[0].path" class="brand">
      <span class="brand-logo" aria-hidden="true">{{ site.logo }}</span>
      <span class="brand-txt">
        <span class="brand-name">{{ site.name }}</span>
        <span v-if="site.tagline" class="brand-tag">{{ site.tagline }}</span>
      </span>
    </RouterLink>

    <ul class="list">
      <li v-for="item in menu" :key="item.key">
        <RouterLink :to="item.path" class="item" :class="{ 'is-soon': !item.ready }">
          <span class="ico" aria-hidden="true">{{ item.icon }}</span>
          <span class="txt">
            <span class="vi">{{ item.label }}</span>
            <span v-if="item.labelZh" class="zh">{{ item.labelZh }}</span>
          </span>
          <span v-if="!item.ready" class="soon">Sắp có</span>
        </RouterLink>
      </li>
    </ul>

    <p v-if="site.footer" class="foot">{{ site.footer }}</p>
  </nav>
</template>

<style scoped>
/* Tấm ván treo bên trái — cùng chất liệu với .panel nhưng bo góc mềm hơn */
.nav{
  background:linear-gradient(180deg,#FBF1D8,#F0DDB2);
  border:3px solid #8A5A2B;border-radius:18px;
  box-shadow:0 8px 0 #6B3D20,0 16px 32px rgba(0,0,0,.3);
  padding:14px 12px 12px;
}

/* Bảng tên ở đỉnh menu */
.brand{
  display:flex;align-items:center;gap:10px;text-decoration:none;
  padding:0 4px 12px;margin-bottom:10px;
  border-bottom:2px dashed #D9BE8E;
}
.brand-logo{
  display:grid;place-items:center;flex:none;width:36px;height:36px;border-radius:10px;
  background:linear-gradient(180deg,var(--wood-2),var(--wood));
  border:2px solid #8A5A2B;box-shadow:0 3px 0 #35190C;font-size:18px;
}
.brand-txt{display:flex;flex-direction:column;line-height:1.15;min-width:0}
.brand-name{font-family:"Baloo 2",cursive;font-weight:800;font-size:17px;color:var(--wood)}
.brand-tag{font-size:11px;color:var(--ink-soft)}

.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}

.item{
  position:relative;display:flex;align-items:center;gap:10px;text-decoration:none;
  padding:9px 10px;border-radius:12px;color:var(--wood);
  border:2px solid transparent;background:transparent;
  transition:background .12s ease, border-color .12s ease, transform .08s ease;
}
/* Thanh nhấn bên trái, chỉ hiện khi hover / đang mở */
.item::before{
  content:"";position:absolute;left:-12px;top:50%;transform:translateY(-50%);
  width:4px;height:0;border-radius:0 4px 4px 0;background:var(--gold);
  transition:height .14s ease;
}
.item:hover{background:#F3E2BC;border-color:#E0C99B}
.item:hover::before{height:20px}
.item:active{transform:translateY(1px)}

.item.router-link-active{
  background:linear-gradient(180deg,var(--wood-2),var(--wood));
  border-color:#35190C;color:#FBF1D8;
  box-shadow:0 3px 0 #35190C,0 6px 14px rgba(0,0,0,.28);
}
.item.router-link-active::before{height:26px;background:var(--gold)}
.item.router-link-active .zh{opacity:.85}

.item.is-soon{color:#7A6047}
.item.is-soon .ico{filter:grayscale(.35);opacity:.8}

.ico{
  display:grid;place-items:center;flex:none;width:28px;height:28px;border-radius:9px;
  background:#EBD6A8;border:1px solid #CFAF79;font-size:15px;line-height:1;
}
.item.router-link-active .ico{background:#FBF1D8;border-color:#FBF1D8}

.txt{display:flex;flex-direction:column;line-height:1.15;min-width:0}
.vi{font-family:"Baloo 2",cursive;font-weight:800;font-size:15px}
.zh{font-size:11px;opacity:.7}

.soon{
  margin-left:auto;flex:none;
  font-size:10px;font-weight:700;padding:2px 7px;border-radius:999px;
  background:#B8482B;color:#fff;box-shadow:0 1px 0 rgba(0,0,0,.2);
}

.foot{
  margin:12px 4px 0;padding-top:10px;border-top:2px dashed #D9BE8E;
  font-size:11px;line-height:1.5;color:var(--ink-soft);
}

/* Màn hình hẹp: menu thành dải ngang cuộn được, bỏ phần phụ */
@media (max-width:760px){
  .nav{padding:10px;border-radius:14px}
  .brand{padding-bottom:10px;margin-bottom:8px}
  .list{flex-direction:row;flex-wrap:nowrap;overflow-x:auto;gap:8px;-webkit-overflow-scrolling:touch}
  .list li{flex:none}
  .item{border-color:#E0C99B;background:#F3E2BC}
  .item::before{display:none}
  .foot{display:none}
}
</style>
