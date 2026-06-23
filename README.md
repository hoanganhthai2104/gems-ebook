# GEMS Medical E-Reader 📚

Ứng dụng đọc sách y khoa trực tuyến với giao diện Liquid Glass hiện đại.

## 🌟 Tính năng

- **Thư viện sách y khoa** với 3D Carousel và bộ lọc chuyên khoa
- **Trình đọc E-Reader** với lật trang, đánh dấu, highlight văn bản
- **Kiểm tra kiến thức** sau mỗi chương với hệ thống quiz tương tác
- **Nhiệm vụ hàng ngày** và hệ thống GEMS Xu gamification
- **Hồ sơ tác giả** chi tiết với tiểu sử và thành tựu
- **Giao diện đa theme** (Trắng, Sepia, Tối) cho trình đọc

## 🚀 Deploy lên Vercel

### Cách 1: Deploy trực tiếp từ GitHub
1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com) và đăng nhập
3. Nhấn **"New Project"** → Import repository từ GitHub
4. Trong phần cấu hình:
   - **Framework Preset**: `Other`
   - **Output Directory**: `.` (thư mục gốc)
5. Nhấn **Deploy**

### Cách 2: Deploy bằng Vercel CLI
```bash
npm i -g vercel
vercel
```

## 💻 Chạy local

```bash
node server.js
# Truy cập http://localhost:8080
```

## 📁 Cấu trúc dự án

```
EBOOK GEMS/
├── index.html          # Ứng dụng chính (Single Page App)
├── covers/             # Ảnh bìa sách
│   ├── cothe.png
│   ├── ditruyen.png
│   ├── thankinh.png
│   ├── thaoduoc.png
│   ├── thucduong.png
│   └── trathaomoc.png
├── server.js           # Server phát triển local
├── vercel.json         # Cấu hình Vercel deployment
├── package.json        # Metadata dự án
└── .gitignore          # Git ignore rules
```

## 🛠 Công nghệ

- **HTML5** + **JavaScript** (Vanilla)
- **Tailwind CSS** (CDN)
- **Google Material Symbols** (Icons)
- **Inter & Playfair Display** (Typography)

## 📄 License

ISC © GEMS Group
