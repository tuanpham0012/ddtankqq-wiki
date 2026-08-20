# DDTank Wiki

Bản Vue 3 + Vite của `bang-cong-thuc-bep-ma-phap.html` (Bếp Ma Pháp — DDTank Mobile).

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # xuất ra dist/
npm run preview  # xem thử bản build
```

Router dùng **hash history** (`/#/bep-ma-phap`) nên thư mục `dist/` host tĩnh ở đâu cũng chạy,
không cần cấu hình rewrite phía server.

## Cấu trúc

```
src/
  data/menu.json           ← DANH SÁCH MENU: sửa ở đây khi thêm tính năng
  menu.js                  ← nạp data/menu.json cho router + SiteNav
  router/index.js          ← sinh route tự động từ menu
  data/recipes.json        ← 11 món, tách từ HTML gốc
  data/pets.json           ← 37 thú cưng (6 EX + 31 S), tên Việt khớp với recipes.json
  data/pet-details.json    ← chỉ số + kỹ năng từng pet (bổ sung dần theo id)
  data/formations.json     ← mốc kích hoạt trận hình pet (4 hệ × 2 nhóm)
  data/shop.json           ← cửa hàng Ma Pháp: giá 11 hạt giống + vật phẩm khác
  data/upgrades.json       ← 55 mô-đun Siêu cải tiến theo cost 1-5 (detail bổ sung dần)
  data/soul-bodies.json    ← hồn thể Thần Điện: chỉ số + từ điều + kỹ năng (bổ sung dần)
  data/mounts.json         ← thú cưỡi: chỉ số gốc + mốc mở khoá + kỹ năng theo bậc
  assets/items/*.png       ← 14 icon vật phẩm cửa hàng
  assets/upgrades/*.png    ← 55 icon mô-đun Siêu cải tiến
  assets/dishes/*.png      ← 11 ảnh món, tách từ base64 trong HTML gốc
  assets/pets/*.png        ← 37 ảnh pet, cắt từ ảnh chụp đồ giám trong game
  assets/soul-bodies/*.png ← ảnh hồn thể, cắt từ ảnh chụp bảng Thần Điện
  assets/mounts/*.png      ← ảnh thú cưỡi, cắt từ ảnh chụp bảng Thú cưỡi
  assets/theme.css         ← biến màu + style dùng chung (giữ nguyên bản gốc)
  components/
    SiteNav.vue            ← menu dọc bên trái (tự xuống hàng ngang khi màn hình < 900px)
    SiteHeader.vue         ← bảng hiệu tiêu đề
    RecipeTable.vue        ← bảng công thức, render từ recipes.json
  views/
    BepMaPhapView.vue      ← trang Bếp Ma Pháp
    ThuCungView.vue        ← trang Thú cưng, nối pet ↔ món ăn từ recipes.json
    TranHinhView.vue       ← trang Trận hình pet
    TrongTrotView.vue      ← trang Trồng trọt, tự tính chi phí hạt giống mỗi món
    SieuCaiTienView.vue    ← trang Siêu cải tiến (mô-đun theo cost)
    HonTheView.vue         ← trang Hồn thể (Thần Điện)
    ThuCuoiView.vue        ← trang Thú cưỡi
    ComingSoonView.vue     ← trang mặc định cho mục chưa có nội dung
```

## Thêm một trang / tính năng mới

1. Thêm một mục vào mảng trong `src/data/menu.json`, đặt `ready: false` — menu hiện ngay với nhãn "Sắp có",
   bấm vào sẽ ra trang `ComingSoonView`.
2. Khi có nội dung: tạo `src/views/TenTrangView.vue`, đăng ký nó trong object `views` ở
   `src/router/index.js` theo đúng `key`, rồi đổi mục đó thành `ready: true`.

Không cần đụng tới `App.vue` hay khai báo route thủ công.

## Cấu trúc một món trong `recipes.json`

```json
{
  "id": "hat-de-xao-toi-vang-bao-diem",
  "method": "fry",                       // fry | stew | mix
  "methodVi": "Xào / Áp chảo",
  "methodZh": "煎炒",
  "nameVi": "Hạt dẻ xào tỏi vàng Bạo Diễm",
  "nameZh": "爆炎金蒜炒栗",
  "image": "hat-de-xao-toi-vang-bao-diem.png",   // tên file trong src/assets/dishes/
  "stats": ["Công kích +60", "Xuyên phá vật công +20"],
  "recipe": [{ "name": "Ớt Dung Nham", "qty": 4 }],
  "peak": 330,
  "pets": [{ "name": "Chiến Hùng", "hot": true }]
}
```

Bảng tự gom nhóm theo `method` và tính `rowspan`, nên chỉ cần thêm/sửa món trong JSON —
thứ tự các món trong file quyết định thứ tự hiển thị.

## Đối chiếu với bản gốc

Đã so khớp tự động DOM của bản Vue với `bang-cong-thuc-bep-ma-phap.html`:
12/12 dòng bảng (1 header + 11 món) trùng khớp từng ô, kể cả `rowspan` cột "Cách nấu",
và 11 ảnh có cùng kích thước gốc.
