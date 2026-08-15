<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipes: { type: Array, required: true },
})

// Vite gom sẵn toàn bộ ảnh trong src/assets/dishes -> URL sau khi build
const images = import.meta.glob('../assets/dishes/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const imageUrl = (file) => images[`../assets/dishes/${file}`]

// Mỗi món kèm thông tin nhóm "cách nấu": ô đầu nhóm sẽ có rowspan
const rows = computed(() => {
  const size = {}
  for (const r of props.recipes) size[r.method] = (size[r.method] || 0) + 1
  const seen = new Set()
  return props.recipes.map((r) => {
    const first = !seen.has(r.method)
    seen.add(r.method)
    return { ...r, groupStart: first, rowspan: first ? size[r.method] : 0 }
  })
})
</script>

<template>
  <div class="scroll">
    <table>
      <caption>Bảng công thức Bếp Ma Pháp</caption>
      <thead>
        <tr>
          <th scope="col">Cách nấu<small>烹饪方法</small></th>
          <th scope="col">Tên món<small>名称</small></th>
          <th scope="col">Hình<small>图例</small></th>
          <th scope="col">Thuộc tính cực phẩm<small>极品属性加成</small></th>
          <th scope="col">Công thức<small>配方</small></th>
          <th scope="col">Max Đồ giám<small>图鉴最高值</small></th>
          <th scope="col">Thú cưng yêu thích<small>宠物喜好</small></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id" :id="row.id"
            :class="[`r-${row.method}`, { 'group-start': row.groupStart }]">
          <th v-if="row.groupStart" class="method" :rowspan="row.rowspan" scope="rowgroup">
            <span class="m-vi">{{ row.methodVi }}</span>
            <span class="m-zh">{{ row.methodZh }}</span>
          </th>
          <td class="dish">
            <span class="d-vi">{{ row.nameVi }}</span>
            <span class="d-zh">{{ row.nameZh }}</span>
          </td>
          <td class="pic">
            <img :src="imageUrl(row.image)" :alt="row.nameVi" width="54" height="54" loading="lazy">
          </td>
          <td class="attr">
            <span v-for="stat in row.stats" :key="stat" class="stat">{{ stat }}</span>
          </td>
          <td class="recipe">
            <span v-for="ing in row.recipe" :key="ing.name" class="ing">
              <b>{{ ing.name }}</b><i>{{ ing.qty }}</i>
            </span>
          </td>
          <td class="peak">{{ row.peak }}</td>
          <td class="pets">
            <span v-for="pet in row.pets" :key="pet.name" class="pet" :class="{ hot: pet.hot }">{{ pet.name }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p class="hint">← Kéo ngang để xem hết bảng →</p>
</template>

<style scoped>
.scroll{
  background:var(--board);border:3px solid #8A5A2B;border-radius:16px;
  box-shadow:0 10px 0 #6B3D20,0 20px 40px rgba(0,0,0,.35);
  overflow-x:auto;-webkit-overflow-scrolling:touch;
}
table{border-collapse:collapse;width:100%;min-width:940px}
caption{caption-side:bottom;padding:0;font-size:0;height:0;overflow:hidden}

thead th{
  background:linear-gradient(180deg,var(--wood-2),var(--wood));
  color:#FBF1D8;font-family:"Baloo 2",cursive;font-weight:600;
  font-size:14px;letter-spacing:.02em;padding:12px 12px;
  border-right:1px solid rgba(251,241,216,.22);
  position:sticky;top:0;z-index:3;text-align:left;
}
thead th:last-child{border-right:0}
thead th small{display:block;font-family:"Be Vietnam Pro",sans-serif;font-weight:400;font-size:11px;opacity:.72}

tbody td,tbody th{border-top:1px solid var(--line);padding:11px 12px;vertical-align:middle}
tbody tr:nth-child(odd){background:var(--board-2)}
tbody tr:nth-child(even){background:#F1DFB6}

th.method{
  width:96px;text-align:center;border-right:3px solid var(--line);
  background:#EBD6A6;
}
.m-vi{display:block;font-family:"Baloo 2",cursive;font-weight:800;font-size:16px;line-height:1.2}
.m-zh{display:block;margin-top:2px;font-size:12px;color:var(--ink-soft)}
.r-fry th.method .m-vi{color:var(--fry)}
.r-stew th.method .m-vi{color:var(--stew)}
.r-mix th.method .m-vi{color:var(--mix)}
tr.group-start > td,tr.group-start > th{border-top:3px solid #B8956A}
tbody tr:first-child > td,tbody tr:first-child > th{border-top:0}

td.dish{width:198px}
.d-vi{display:block;font-weight:700;font-size:14px;line-height:1.3}
.d-zh{display:block;margin-top:2px;font-size:12px;color:var(--ink-soft)}

td.pic{width:74px;text-align:center;padding:6px}
td.pic img{width:54px;height:54px;display:block;margin:0 auto;border-radius:10px;
  box-shadow:0 2px 6px rgba(51,31,18,.28)}

td.attr{width:250px}
.stat{display:block;font-size:13px;font-weight:600;line-height:1.5}
.stat::before{content:"\25B8 ";color:var(--gold);font-weight:700}

td.recipe{width:230px}
.ing{display:flex;align-items:baseline;gap:6px;font-size:13px;line-height:1.55}
.ing b{font-weight:500}
.ing i{
  font-style:normal;font-weight:700;font-size:12px;color:#fff;
  background:#B8482B;border-radius:999px;padding:1px 7px;margin-left:auto;
}

td.peak{width:78px;text-align:center;font-family:"Baloo 2",cursive;
  font-weight:800;font-size:20px;color:var(--gold)}

td.pets{min-width:210px}
</style>
