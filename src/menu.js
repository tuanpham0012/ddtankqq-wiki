/**
 * Menu điều hướng — dữ liệu nằm ở `src/data/menu.json`, file này chỉ nạp lại.
 * CHỈ SỬA src/data/menu.json khi thêm/bớt mục menu.
 *
 * Mỗi mục:
 *   key    : định danh, dùng làm route name
 *   label  : tên hiển thị (tiếng Việt)
 *   labelZh: tên gốc tiếng Trung (để trống nếu chưa có)
 *   path   : đường dẫn URL
 *   icon   : emoji/ký tự hiển thị cạnh tên
 *   ready  : true  -> có trang thật (khai báo component trong src/router/index.js)
 *            false -> hiện nhãn "Sắp có", vào sẽ ra trang ComingSoon
 */
import menuData from './data/menu.json'

export const menu = menuData
