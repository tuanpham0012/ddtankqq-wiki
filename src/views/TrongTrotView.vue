<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import shop from '../data/shop.json'
import recipes from '../data/recipes.json'

const magic = shop.shops.find((s) => s.key === 'magic')

// Icon cắt từ ảnh chụp cửa hàng, đặt tên theo `id` của vật phẩm (hoặc field `image` nếu muốn khác)
const icons = import.meta.glob('../assets/items/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const iconUrl = (item) => icons[`../assets/items/${item.image || `${item.id}.png`}`]

// Nguyên liệu nào dùng cho món nào — suy ra từ recipes.json
const usage = computed(() => {
  const map = {}
  for (const r of recipes) {
    for (const i of r.recipe) {
      ;(map[i.name] ||= []).push({ id: r.id, nameVi: r.nameVi, method: r.method, qty: i.qty })
    }
  }
  return map
})

const seeds = computed(() =>
  magic.items
    .filter((i) => i.type === 'seed')
    .map((i) => ({ ...i, dishes: usage.value[i.ingredient] || [] })),
)
const others = computed(() => magic.items.filter((i) => i.type !== 'seed'))

// Bảng giá hạt giống theo tên nguyên liệu, dùng để tính chi phí mỗi món
const priceOf = computed(() =>
  Object.fromEntries(seeds.value.map((s) => [s.ingredient, s.price])),
)

const dishCosts = computed(() =>
  recipes
    .map((r) => {
      const parts = r.recipe.map((i) => ({
        ...i,
        price: priceOf.value[i.name],
        sum: (priceOf.value[i.name] || 0) * i.qty,
      }))
      return {
        id: r.id,
        nameVi: r.nameVi,
        nameZh: r.nameZh,
        method: r.method,
        methodVi: r.methodVi,
        parts,
        total: parts.reduce((n, p) => n + p.sum, 0),
        unknown: parts.some((p) => !p.price),
      }
    })
    .sort((a, b) => a.total - b.total),
)

const sort = ref('price')
const sortedSeeds = computed(() => {
  const list = [...seeds.value]
  if (sort.value === 'price') return list.sort((a, b) => a.price - b.price)
  if (sort.value === 'use') return list.sort((a, b) => b.dishes.length - a.dishes.length)
  return list.sort((a, b) => a.nameVi.localeCompare(b.nameVi, 'vi'))
})

const fmt = (n) => n.toLocaleString('vi-VN')
</script>

<template>
  <SiteHeader
    title="Trồng trọt — Cửa hàng hạt giống"
    subtitle="Cửa hàng Ma Pháp · Thị Trấn"
    subtitle-zh="小镇商店：魔法商店"
  />

  <section class="panel tools">
    <p class="lead">
      {{ magic.note }} Toàn bộ <b>{{ seeds.length }} loại hạt giống</b> đều mua bằng
      <span class="coin">Kim Tệ 金币</span>, mỗi loại giới hạn <b>5 hạt/ngày</b>.
    </p>
    <div class="chips">
      <span class="lb">Sắp xếp</span>
      <button type="button" class="chip" :class="{ on: sort === 'price' }" @click="sort = 'price'">Giá</button>
      <button type="button" class="chip" :class="{ on: sort === 'use' }" @click="sort = 'use'">Dùng nhiều</button>
      <button type="button" class="chip" :class="{ on: sort === 'name' }" @click="sort = 'name'">Tên</button>
    </div>
  </section>

  <ul class="grid">
    <li v-for="s in sortedSeeds" :key="s.id" class="card">
      <div class="head">
        <img v-if="iconUrl(s)" class="ico" :src="iconUrl(s)" :alt="s.nameVi" loading="lazy" />
        <span class="ht">
          <span class="n-vi">{{ s.nameVi }}</span>
          <span class="n-zh">{{ s.nameZh }}</span>
        </span>
      </div>
      <p class="price"><span class="coin" aria-hidden="true">🪙</span> {{ fmt(s.price) }}</p>
      <p class="limit">
        {{ s.limitVi }}<span class="zh">{{ s.limitZh }}</span>
        <b v-if="s.dailyStock">· {{ s.dailyStock }} hạt/ngày</b>
      </p>
      <p class="uses">
        <span class="lb">Dùng cho {{ s.dishes.length }} món</span>
        <RouterLink v-for="d in s.dishes" :key="d.id" class="dish" :class="`m-${d.method}`"
                    :to="{ name: 'bep-ma-phap', hash: `#${d.id}` }">
          {{ d.nameVi }} <b>×{{ d.qty }}</b>
        </RouterLink>
      </p>
    </li>
  </ul>

  <section class="panel costs">
    <h2>Chi phí hạt giống mỗi món<small>每道菜的种子成本</small></h2>
    <p class="sub">Tính theo giá niêm yết × số lượng nguyên liệu trong công thức, xếp từ rẻ tới đắt.</p>
    <div class="scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Món</th>
            <th scope="col">Nguyên liệu × số lượng</th>
            <th scope="col" class="num">Tổng</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in dishCosts" :key="d.id" :class="`r-${d.method}`">
            <th scope="row">
              <RouterLink :to="{ name: 'bep-ma-phap', hash: `#${d.id}` }">{{ d.nameVi }}</RouterLink>
              <small>{{ d.nameZh }}</small>
            </th>
            <td>
              <span v-for="(p, i) in d.parts" :key="i" class="part">
                {{ p.name }} ×{{ p.qty }}
                <i>{{ p.price ? fmt(p.sum) : '?' }}</i>
              </span>
            </td>
            <td class="num total">{{ d.unknown ? '?' : fmt(d.total) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <section class="panel others">
    <h2>Vật phẩm khác trong cửa hàng<small>其他商品</small></h2>
    <ul class="olist">
      <li v-for="o in others" :key="o.id">
        <img v-if="iconUrl(o)" class="o-ico" :src="iconUrl(o)" :alt="o.nameVi" loading="lazy" />
        <span class="o-vi">{{ o.nameVi }}</span>
        <span class="o-zh">{{ o.nameZh }}</span>
        <span class="o-price">🪙 {{ fmt(o.price) }}</span>
        <span class="o-limit">{{ o.limitVi }} <i>{{ o.limitZh }}</i></span>
      </li>
    </ul>
  </section>

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Cửa hàng Thị Trấn có 3 quầy: <b>普通商店</b>, <b>生活商店</b> và <b>魔法商店</b> — trang này mới có dữ liệu quầy Ma Pháp.</li>
      <li>Số "剩余5个" trong game là <b>lượt mua còn lại trong ngày</b> của tài khoản, làm mới mỗi ngày.</li>
      <li>Bấm tên món để nhảy sang <b>Bếp Ma Pháp</b> xem công thức đầy đủ.</li>
      <li>Cập nhật giá hoặc thêm quầy khác: sửa <b>src/data/shop.json</b>, giữ đúng tên nguyên liệu như trong
        <b>recipes.json</b> để phần nối món ăn vẫn chạy.</li>
    </ul>
  </section>
</template>

<style scoped>
.lead{margin:0 0 10px;font-size:13px;line-height:1.6}
.coin{color:var(--gold);font-weight:700}
.chips{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.chips .lb{font-size:11.5px;font-weight:700;color:var(--ink-soft)}
.chip{
  cursor:pointer;font:inherit;font-size:12.5px;font-weight:700;color:var(--wood);
  padding:5px 12px;border-radius:999px;background:#EBD6A8;border:2px solid #CFAF79;
}
.chip:hover{background:#F3E2BC}
.chip.on{background:linear-gradient(180deg,var(--wood-2),var(--wood));border-color:#35190C;color:#FBF1D8}

.grid{
  list-style:none;margin:16px 0 0;padding:0;display:grid;gap:12px;
  grid-template-columns:repeat(auto-fill,minmax(230px,1fr));
}
.card{
  padding:11px 13px 12px;border-radius:14px;
  background:#FBF1D8;border:3px solid #C9A96E;
  box-shadow:0 6px 0 #6B3D20,0 12px 24px rgba(0,0,0,.26);
}
.head{display:flex;align-items:center;gap:9px;line-height:1.2;margin-bottom:6px}
.ico{
  flex:none;width:48px;height:48px;border-radius:10px;
  border:2px solid #C9A96E;background:#EBD6A8;object-fit:cover;
}
.ht{min-width:0}
.n-vi{display:block;font-family:"Baloo 2",cursive;font-weight:800;font-size:15px;color:var(--wood)}
.n-zh{display:block;font-size:11px;color:var(--ink-soft)}
.price{
  margin:0;display:inline-flex;align-items:center;gap:5px;
  font-size:16px;font-weight:800;color:#B8862B;
}
.limit{margin:4px 0 8px;font-size:11px;color:var(--ink-soft)}
.limit .zh{margin-left:5px}
.limit b{color:var(--ink);font-weight:700}
.uses{margin:0;display:flex;flex-wrap:wrap;gap:4px;padding-top:8px;border-top:1px dashed #D9BE8E}
.uses .lb{width:100%;font-size:10.5px;font-weight:700;color:var(--ink-soft)}
.dish{
  font-size:11.5px;text-decoration:none;color:var(--ink);
  padding:2px 8px;border-radius:999px;background:#E7D3A5;border:1px solid #C9A96E;
}
.dish b{color:var(--gold)}
.dish:hover{background:#F3E2BC}
.dish.m-fry{border-color:var(--fry)}
.dish.m-stew{border-color:var(--stew)}
.dish.m-mix{border-color:var(--mix)}

.costs,.others,.notes{margin-top:18px}
.costs h2 small,.others h2 small{margin-left:7px;font-size:11.5px;font-weight:500;color:var(--ink-soft)}
.sub{margin:0 0 10px;font-size:12px;color:var(--ink-soft)}
.scroll{overflow-x:auto}
.costs table{border-collapse:collapse;width:100%;min-width:520px}
.costs th,.costs td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top;font-size:12.5px}
.costs thead th{background:#EBD6A8;font-size:12px;color:var(--wood)}
.costs tbody th{background:#FFF8E7;font-weight:700}
.costs tbody th a{color:var(--wood);text-decoration:none;border-bottom:1px dashed #C9A96E}
.costs tbody th a:hover{color:var(--fry)}
.costs tbody th small{display:block;font-size:10.5px;font-weight:500;color:var(--ink-soft)}
.costs tr.r-fry th{border-left:4px solid var(--fry)}
.costs tr.r-stew th{border-left:4px solid var(--stew)}
.costs tr.r-mix th{border-left:4px solid var(--mix)}
.part{display:inline-block;margin:0 8px 3px 0;white-space:nowrap}
.part i{font-style:normal;color:var(--gold);font-weight:700}
.num{text-align:right}
.total{font-weight:800;color:#B8862B;white-space:nowrap}

.olist{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
.olist li{
  display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;
  padding:8px 10px;border-radius:10px;background:#FFF8E7;border:2px solid #E4D0A6;font-size:12.5px;
}
.o-ico{
  flex:none;width:40px;height:40px;border-radius:9px;
  border:2px solid #C9A96E;background:#EBD6A8;object-fit:cover;
}
.o-vi{font-weight:700;color:var(--wood)}
.o-zh{font-size:11px;color:var(--ink-soft)}
.o-price{margin-left:auto;font-weight:800;color:#B8862B}
.o-limit{font-size:11px;color:var(--ink-soft)}
.o-limit i{font-style:normal;opacity:.8}

@media (max-width:620px){
  .grid{grid-template-columns:repeat(auto-fill,minmax(170px,1fr))}
  .o-price{margin-left:0}
}
</style>
