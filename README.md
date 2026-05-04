# CodeCamp - Nền tảng Học lập trình Đa ngôn ngữ (Java, C++, C, Python)

CodeCamp là một nền tảng học lập trình full-stack toàn diện, được thiết kế với giao diện cao cấp (Premium Dark Theme + Glassmorphism). Ứng dụng cung cấp các bài giảng lý thuyết, danh sách bài tập từ các nguồn nổi tiếng (LeetCode, HackerRank, Codeforces...) và môi trường Code Editor tích hợp để người dùng có thể viết, chạy thử và nộp bài trực tiếp trên trình duyệt.

![Trạng thái dự án](https://img.shields.io/badge/Tr%E1%BA%A1ng%20th%C3%A1i-Ho%C3%A0n%20th%C3%A0nh-success) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-blue)

---

## ✨ Tính năng nổi bật

### Giao diện người dùng (Frontend)
- **Thiết kế Premium Dark Theme:** Sử dụng kỹ thuật Glassmorphism mang lại trải nghiệm hiện đại, bóng bẩy và chuyên nghiệp, hỗ trợ Responsive hoàn hảo trên mọi thiết bị (Mobile/Tablet/PC).
- **Trình soạn thảo Code tích hợp (IDE):** Tích hợp `Monaco Editor` (trình soạn thảo lõi của VS Code) hỗ trợ highlight cú pháp chuẩn cho Java, C++, C và Python.
- **Tính năng Chạy & Nộp bài trực tiếp:** 
  - Nút **Chạy thử**: Cho phép biên dịch và chạy code với test case mở, hiển thị kết quả ở Terminal Console bên dưới.
  - Nút **Nộp bài**: Hệ thống tự động chấm điểm bài tập thông qua các Test Case ẩn/hiện, tính phần trăm vượt qua và cộng điểm tự động.
- **Bảng xếp hạng (Leaderboard):** Vinh danh top Coder có điểm số cao nhất trên nền tảng với biểu tượng xếp hạng trực quan.
- **Dashboard Học Tập:** Chia layout thông minh gồm Lộ trình học (Sidebar) - Lý thuyết & Đề bài (Middle) - Trình soạn thảo Code (Right).

### Hệ thống Server (Backend)
- **Hỗ trợ 4 ngôn ngữ cốt lõi:** Java, C++, C, và Python 3.
- **Code Runner an toàn:** Hệ thống tự động tạo môi trường ảo thông qua `child_process`, giới hạn thời gian (Timeout 5s) và biên dịch mã nguồn trực tiếp trên máy chủ.
- **Seed Data có sẵn:** Script tạo sẵn cấu trúc khóa học và hơn 80 bài tập mẫu đa dạng độ khó (20 bài/ngôn ngữ).
- **Bảo mật JWT:** Hệ thống xác thực người dùng bằng JSON Web Token (JWT) và mã hóa mật khẩu với `bcryptjs`.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router DOM, Monaco Editor React, Axios, Vanilla CSS, Lucide React (Icons).
- **Backend:** Node.js, Express.js, Mongoose, JSONWebToken, BcryptJS.
- **Database:** MongoDB Atlas.
- **System Requirements:** Nếu chạy Local, máy host cần cài sẵn `javac/java`, `g++`, `gcc`, và `python`/`python3`.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy (Localhost)

### 1. Cấu hình Backend
```bash
# 1. Di chuyển vào thư mục backend
cd server

# 2. Cài đặt thư viện
npm install

# 3. Tạo dữ liệu mẫu (Sẽ tự động nạp bài giảng Java, C++, C, Python)
npm run seed

# 4. Khởi động API Server
npm run dev
```

### 2. Cấu hình Frontend
```bash
# 1. Di chuyển vào thư mục frontend
cd client

# 2. Cài đặt thư viện React
npm install

# 3. Khởi chạy giao diện Web
npm run dev
```

---

## ☁️ Hướng dẫn Đẩy lên Cloud (Deploy)

Dự án này đã được tối ưu để hoạt động hoàn hảo với các dịch vụ Cloud hiện đại:

### Bước 1: Deploy Backend (Render.com)
1. Tạo một Web Service trên Render, kết nối với thư mục `server`.
2. Cấu hình lệnh:
   - Build Command: `npm install`
   - Start Command: `npm start`
3. Thêm biến môi trường (Environment Variables):
   - `MONGO_URI`: Chuỗi kết nối MongoDB Atlas của bạn.
   - `JWT_SECRET`: Chuỗi bảo mật bất kỳ.

### Bước 2: Nạp dữ liệu vào Database
Do lỗi nhà mạng chặn phân giải DNS (querySrv) khi dùng mạng ở VN, cách tốt nhất để chạy lệnh nạp dữ liệu là chạy trực tiếp trên Cloud:
- Mở tab **Shell** trong trang quản trị dự án Render.
- Gõ lệnh `npm run seed` và ấn Enter.

### Bước 3: Deploy Frontend (Vercel)
1. Sửa URL kết nối Backend trong file `client/src/api/index.js` thành link Render của bạn.
2. Tạo dự án mới trên Vercel, trỏ thư mục gốc (Root Directory) vào mục `client`.
3. Bấm Deploy và trải nghiệm.

---

## 📖 Hướng dẫn sử dụng cho người học

1. **Lộ trình học:** Ở menu bên trái, chọn ngôn ngữ bạn muốn học (Java, C++, C, Python). Đi tuần tự từ trên xuống dưới. Bài "Bài 0: Hướng dẫn & Làm quen" sẽ hướng dẫn bạn cú pháp khai báo cơ bản nhất của từng ngôn ngữ.
2. **Giao diện bài tập:** Đọc lý thuyết ở cột giữa. Sau đó chọn một bài tập bất kỳ, đề bài sẽ hiển thị lên cùng với các Test Case mẫu.
3. **Thực hành Code:** Cột bên phải là nơi bạn viết code. Lưu ý không đổi tên hàm hoặc tên class nếu bài tập có yêu cầu cụ thể (với Java bắt buộc là `class Main`).
4. **Nộp bài:** Ấn `Chạy Code` để test lỗi cú pháp. Ấn `Nộp bài` để hệ thống chấm tự động và cộng điểm vào Bảng Xếp Hạng.
