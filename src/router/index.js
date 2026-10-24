import { createRouter, createWebHashHistory } from 'vue-router'
import { menu } from '../menu.js'
import BepMaPhapView from '../views/BepMaPhapView.vue'
import ThuCungView from '../views/ThuCungView.vue'
import TranHinhView from '../views/TranHinhView.vue'
import TrongTrotView from '../views/TrongTrotView.vue'
import SieuCaiTienView from '../views/SieuCaiTienView.vue'
import HonTheView from '../views/HonTheView.vue'
import ThuCuoiView from '../views/ThuCuoiView.vue'
import VuKhiView from '../views/VuKhiView.vue'
import TrangBiView from '../views/TrangBiView.vue'
import ComingSoonView from '../views/ComingSoonView.vue'

// Trang đã có nội dung thật: khai báo ở đây theo `key` trong src/data/menu.json.
// Mục nào không khai báo (ready: false) sẽ tự động dùng ComingSoonView.
const views = {
  'bep-ma-phap': BepMaPhapView,
  'thu-cung': ThuCungView,
  'tran-hinh': TranHinhView,
  'trong-trot': TrongTrotView,
  'sieu-cai-tien': SieuCaiTienView,
  'hon-the': HonTheView,
  'thu-cuoi': ThuCuoiView,
  'vu-khi': VuKhiView,
  'trang-bi': TrangBiView,
}

const routes = menu.map((item) => ({
  path: item.path,
  name: item.key,
  component: views[item.key] || ComingSoonView,
  meta: { menu: item },
}))

routes.push({ path: '/', redirect: menu[0].path })
routes.push({ path: '/:pathMatch(.*)*', redirect: menu[0].path })

export default createRouter({
  // Hash history: mở được cả khi host tĩnh (GitHub Pages, mở file build...)
  // không cần cấu hình rewrite phía server.
  history: createWebHashHistory(),
  routes,
  // Link kiểu #dish-id (từ trang Thú cưng sang bảng công thức) sẽ cuộn tới đúng hàng
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, top: 16, behavior: 'smooth' }
    return { top: 0 }
  },
})
