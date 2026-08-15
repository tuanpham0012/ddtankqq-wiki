<script setup>
import { computed, ref } from 'vue'
import SiteHeader from '../components/SiteHeader.vue'
import PetDialog from '../components/PetDialog.vue'
import petsData from '../data/pets.json'
import petDetails from '../data/pet-details.json'
import recipes from '../data/recipes.json'

// Ảnh pet là tuỳ chọn: thả file .png vào src/assets/pets/ đúng tên trong pets.json
const images = import.meta.glob('../assets/pets/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})
const imageUrl = (file) => (file ? images[`../assets/pets/${file}`] : undefined)

// Món ăn mỗi pet yêu thích — suy ra từ recipes.json, không khai báo lại
const dishIndex = computed(() => {
  const map = {}
  for (const r of recipes) {
    for (const p of r.pets || []) {
      const entry = (map[p.name] ||= { hot: false, dishes: [] })
      if (p.hot) entry.hot = true
      entry.dishes.push({ id: r.id, nameVi: r.nameVi, methodVi: r.methodVi, method: r.method })
    }
  }
  return map
})

const rankInfo = computed(() =>
  Object.fromEntries(petsData.ranks.map((r) => [r.key, r])),
)

const pets = computed(() =>
  petsData.pets.map((p) => {
    const found = dishIndex.value[p.nameVi] || { hot: false, dishes: [] }
    return { ...p, hot: found.hot, dishes: found.dishes, details: petDetails[p.id] || null }
  }),
)

const query = ref('')
const rank = ref('all')

// Pet đang mở hộp thoại chi tiết
const opened = ref(null)

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return pets.value.filter((p) => {
    if (rank.value !== 'all' && p.rank !== rank.value) return false
    if (!q) return true
    return `${p.nameVi} ${p.nameZh}`.toLowerCase().includes(q)
  })
})

const countByRank = computed(() => {
  const c = {}
  for (const p of pets.value) c[p.rank] = (c[p.rank] || 0) + 1
  return c
})
</script>

<template>
  <SiteHeader
    title="Thú cưng — Đồ giám"
    subtitle="DDTank Mobile"
    subtitle-zh="弹弹堂手游：宠物图鉴"
  />

  <section class="panel tools">
    <div class="chips">
      <button type="button" class="chip" :class="{ on: rank === 'all' }" @click="rank = 'all'">
        Tất cả <b>{{ pets.length }}</b>
      </button>
      <button v-for="r in petsData.ranks" :key="r.key" type="button"
              class="chip" :class="[`rank-${r.key}`, { on: rank === r.key }]" @click="rank = r.key">
        <span class="tag">{{ r.badge }}</span>{{ r.label }} <b>{{ countByRank[r.key] || 0 }}</b>
      </button>
    </div>

    <label class="search">
      <span class="sr-only">Tìm thú cưng</span>
      <input v-model="query" type="search" placeholder="Tìm theo tên Việt hoặc Trung…" />
    </label>
  </section>

  <p class="count">Hiện {{ filtered.length }} / {{ pets.length }} thú cưng</p>

  <ul class="grid">
    <li v-for="pet in filtered" :key="pet.id" class="card" :class="[`rank-${pet.rank}`, { hot: pet.hot }]">
      <div class="head">
        <span class="name-vi">{{ pet.nameVi }}</span>
        <span class="name-zh">{{ pet.nameZh }}</span>
      </div>

      <div class="art" :class="{ clickable: pet.details }"
           @click="pet.details && (opened = pet)">
        <img v-if="imageUrl(pet.image)" :src="imageUrl(pet.image)" :alt="pet.nameVi" loading="lazy" />
        <template v-else>
          <span class="ph" aria-hidden="true">{{ pet.nameZh.slice(0, 1) }}</span>
          <!-- Ảnh cắt từ game đã có sẵn huy hiệu S/EX nên chỉ vẽ thêm khi thiếu ảnh -->
          <span class="badge">{{ rankInfo[pet.rank]?.badge }}</span>
        </template>
        <span v-if="pet.hot" class="star" title="Bản gốc bôi đỏ — nên cho ăn trước">⭐</span>
      </div>

      <div class="body">
        <p v-if="pet.dishes.length" class="likes">
          <span class="lb">Thích ăn</span>
          <RouterLink v-for="d in pet.dishes" :key="d.id" class="dish" :class="`m-${d.method}`"
                      :to="{ name: 'bep-ma-phap', hash: `#${d.id}` }" :title="d.methodVi">
            {{ d.nameVi }}
          </RouterLink>
        </p>
        <p v-else class="likes none">Chưa rõ món yêu thích</p>
        <p v-if="pet.note" class="note">{{ pet.note }}</p>

        <button v-if="pet.details" type="button" class="skill-btn" @click="opened = pet">
          ⚔️ Xem kỹ năng
        </button>
      </div>
    </li>
  </ul>

  <PetDialog :pet="opened" :image="opened ? imageUrl(opened.image) : ''" @close="opened = null" />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Pet gắn <b>⭐</b> là những con bản gốc bôi đỏ ở bảng công thức — nên cho ăn trước.</li>
      <li>Bấm vào tên món để nhảy sang <b>Bếp Ma Pháp</b> xem công thức đầy đủ.</li>
      <li>Ưu tiên đưa <b>3 thú cưng lên cấp 3</b> (đủ 3 lượt thám hiểm) để lấy <b>+6% gia tăng</b>.</li>
      <li>Pet nào có nút <b>⚔️ Xem kỹ năng</b> là đã nhập chỉ số + kỹ năng (bấm vào ảnh cũng mở được).
        Thêm pet khác thì bổ sung vào <b>src/data/pet-details.json</b> theo <b>id</b> — không phải sửa code.</li>
      <li>Ảnh pet cắt trực tiếp từ ảnh chụp đồ giám trong game, để ở <b>src/assets/pets/</b> theo tên trong <b>src/data/pets.json</b>.</li>
    </ul>
  </section>
</template>

<style scoped>
.tools{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{
  display:inline-flex;align-items:center;gap:6px;cursor:pointer;
  font:inherit;font-size:12.5px;font-weight:700;color:var(--wood);
  padding:6px 12px;border-radius:999px;
  background:#EBD6A8;border:2px solid #CFAF79;
  transition:transform .08s ease, background .12s ease, border-color .12s ease;
}
.chip:hover{transform:translateY(-1px);background:#F3E2BC}
.chip.on{background:linear-gradient(180deg,var(--wood-2),var(--wood));border-color:#35190C;color:#FBF1D8}
.chip b{font-size:11.5px;opacity:.75}
.chip .tag{
  font-size:10px;padding:1px 6px;border-radius:999px;
  background:var(--gold);color:#fff;
}
.chip.rank-ex .tag{background:#B8482B}

.search input{
  font:inherit;font-size:13px;color:var(--ink);
  padding:8px 12px;min-width:230px;border-radius:11px;
  background:#FFF8E7;border:2px solid #CFAF79;
}
.search input:focus{outline:3px solid var(--gold);outline-offset:1px}

.count{margin:14px 2px 10px;font-size:12px;color:#E7D3A5}

.grid{
  list-style:none;margin:0;padding:0;display:grid;gap:14px;
  grid-template-columns:repeat(auto-fill,minmax(196px,1fr));
}

.card{
  display:flex;flex-direction:column;overflow:hidden;
  background:#FBF1D8;border:3px solid #C9A96E;border-radius:16px;
  box-shadow:0 6px 0 #6B3D20,0 12px 24px rgba(0,0,0,.28);
  transition:transform .1s ease, box-shadow .1s ease;
}
.card:hover{transform:translateY(-2px);box-shadow:0 8px 0 #6B3D20,0 16px 30px rgba(0,0,0,.32)}
.card.rank-ex{border-color:#C9603D}

/* Bảng tên trên đầu thẻ — vàng cho S, đỏ cho EX (giống trong game) */
.head{
  padding:7px 10px 8px;text-align:center;line-height:1.15;
  background:linear-gradient(180deg,#F3C24B,#DFA02A);color:#5A3306;
  border-bottom:2px solid #C9A96E;
}
.card.rank-ex .head{background:linear-gradient(180deg,#D9553C,#B03A23);color:#FFF0E6;border-bottom-color:#C9603D}
.name-vi{display:block;font-family:"Baloo 2",cursive;font-weight:800;font-size:14.5px}
.name-zh{display:block;font-size:11px;opacity:.8}

/* Ảnh cắt thẳng từ đồ giám nên đã có sẵn nền gỗ + bãi cỏ, để nó tràn kín ô */
.art{
  position:relative;display:grid;place-items:center;
  aspect-ratio:4/3;background:linear-gradient(180deg,#F7E7C2,#EBD6A8);
}
.art img{display:block;width:100%;height:100%;object-fit:cover}
.art.clickable{cursor:zoom-in}
.art.clickable::after{
  content:"";position:absolute;inset:0;background:rgba(74,42,23,0);transition:background .12s ease;
}
.card:hover .art.clickable::after{background:rgba(74,42,23,.12)}
.ph{
  display:grid;place-items:center;width:64px;height:64px;border-radius:50%;
  background:#E0C79A;border:2px dashed #C9A96E;
  font-size:26px;font-weight:700;color:#9B7B4A;
}
.badge{
  position:absolute;left:50%;bottom:6px;transform:translateX(-50%);
  min-width:26px;padding:1px 8px;border-radius:999px;text-align:center;
  font-size:11px;font-weight:800;color:#fff;
  background:linear-gradient(180deg,#E4B23A,#B8862B);border:1px solid #8A5A2B;
}
.card.rank-ex .badge{background:linear-gradient(180deg,#D9553C,#9A3714);border-color:#7A2A0E}
.limited{
  position:absolute;right:6px;bottom:6px;
  font-size:9.5px;font-weight:800;padding:2px 6px;border-radius:6px;
  background:#B8482B;color:#fff;
}
.star{position:absolute;left:6px;top:6px;font-size:14px}

.body{padding:9px 10px 11px;border-top:2px solid #E4D0A6}
.likes{margin:0;display:flex;flex-wrap:wrap;gap:4px;align-items:baseline}
.lb{font-size:10.5px;font-weight:700;color:var(--ink-soft);width:100%}
.likes.none{font-size:11.5px;color:var(--ink-soft);font-style:italic}
.dish{
  font-size:11.5px;text-decoration:none;color:var(--ink);
  padding:2px 8px;border-radius:999px;
  background:#E7D3A5;border:1px solid #C9A96E;
}
.dish:hover{background:#F3E2BC}
.dish.m-fry{border-color:var(--fry)}
.dish.m-stew{border-color:var(--stew)}
.dish.m-mix{border-color:var(--mix)}
.note{margin:8px 0 0;font-size:11px;line-height:1.45;color:var(--ink-soft)}

.skill-btn{
  display:block;width:100%;margin-top:9px;cursor:pointer;
  font:inherit;font-size:12px;font-weight:700;color:#FBF1D8;
  padding:6px 10px;border-radius:10px;
  background:linear-gradient(180deg,var(--wood-2),var(--wood));
  border:2px solid #35190C;box-shadow:0 3px 0 #35190C;
  transition:transform .08s ease, box-shadow .08s ease, filter .12s ease;
}
.skill-btn:hover{filter:brightness(1.12);transform:translateY(-1px);box-shadow:0 4px 0 #35190C}
.skill-btn:active{transform:translateY(2px);box-shadow:0 1px 0 #35190C}
.skill-btn:focus-visible{outline:3px solid var(--gold);outline-offset:2px}

.notes{margin-top:22px}

@media (max-width:620px){
  .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
  .search input{min-width:0;width:100%}
  .search{flex:1}
}
</style>
