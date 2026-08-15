<script setup>
import SiteHeader from '../components/SiteHeader.vue'
import RecipeTable from '../components/RecipeTable.vue'
import recipes from '../data/recipes.json'
</script>

<template>
  <SiteHeader
    title="Bếp Ma Pháp — Bảng công thức"
    subtitle="DDTank Mobile"
    subtitle-zh="弹弹堂手游：魔法厨房攻略"
  />

  <RecipeTable :recipes="recipes" />

  <section class="panel notes">
    <h2>Ghi chú (备注)</h2>
    <ul>
      <li>Làm món theo đúng tỉ lệ nguyên liệu trong cột <b>Công thức</b>; phẩm chất “cực phẩm” ra <b>ngẫu nhiên</b>.</li>
      <li>Cho thú cưng ăn đúng món nó <b>yêu thích</b> sẽ được thêm gia tăng.</li>
      <li>Nên ưu tiên cho ăn để đưa <b>3 thú cưng lên cấp 3</b> (đủ 3 lượt thám hiểm) nhằm lấy <b>+6% gia tăng</b>.</li>
      <li>Sau đó tiếp tục trồng trọt và nấu để nâng cấp các thú cưng khác, lấy thêm thuộc tính.</li>
    </ul>
    <p class="legend">
      Thú cưng gắn nhãn <span class="pet hot">màu đỏ</span> là những con được bản gốc bôi đỏ — đáng ưu tiên cho ăn trưỗc.
      Một vài tên riêng (Đô Đô, Triều Tịch, Bảo Lũy…) là phiên âm từ tiếng Trung, bạn đối chiếu lại tên hiển thị trong game cho chắc.
    </p>
  </section>
</template>

<style scoped>
.notes{margin-top:22px}
</style>
