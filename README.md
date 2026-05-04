# CodeCamp - Nền tảng Học lập trình Java & C++

CodeCamp là một nền tảng học lập trình full-stack toàn diện dành cho ngôn ngữ Java và C++, được thiết kế với giao diện cao cấp (Premium Dark Theme + Glassmorphism). Ứng dụng cung cấp các bài giảng lý thuyết, danh sách bài tập từ các nguồn nổi tiếng (LeetCode, HackerRank, Codeforces...) và môi trường Code Editor tích hợp để người dùng có thể viết, chạy thử và nộp bài trực tiếp trên trình duyệt.

![Trạng thái dự án](https://img.shields.io/badge/Tr%E1%BA%A1ng%20th%C3%A1i-Ho%C3%A0n%20th%C3%A0nh-success) ![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20MongoDB-blue)

---

## ✨ Tính năng nổi bật

### Giao diện người dùng (Frontend)
- **Thiết kế Premium Dark Theme:** Sử dụng kỹ thuật Glassmorphism mang lại trải nghiệm hiện đại, bóng bẩy và chuyên nghiệp.
- **Trình soạn thảo Code tích hợp (IDE):** Tích hợp `Monaco Editor` (trình soạn thảo lõi của VS Code) hỗ trợ highlight cú pháp chuẩn cho Java và C++.
- **Tính năng Chạy & Nộp bài trực tiếp:** 
  - Nút **Chạy thử**: Cho phép biên dịch và chạy code với test case mở, hiển thị kết quả ở Terminal Console bên dưới.
  - Nút **Nộp bài**: Hệ thống tự động chấm điểm bài tập thông qua các Test Case ẩn/hiện, tính phần trăm vượt qua và cộng điểm tự động.
- **Bảng xếp hạng (Leaderboard):** Vinh danh top 50 Coder có điểm số cao nhất trên nền tảng với biểu tượng xếp hạng trực quan.
- **Dashboard Học Tập:** Chia layout 3 cột tối ưu gồm Lộ trình học (Sidebar) - Lý thuyết & Đề bài (Middle) - Trình soạn thảo Code (Right).

### Hệ thống Server (Backend)
- **Code Runner an toàn:** Hệ thống tự động tạo môi trường ảo thông qua `child_process`, giới hạn thời gian (Timeout 5s) và biên dịch mã nguồn Java/C++ mượt mà.
- **Seed Data có sẵn:** Script tạo sẵn cấu trúc khóa học (Hello World, Biến, Vòng lặp, OOP...) cùng với hơn 20 bài tập mẫu đa dạng độ khó.
- **Bảo mật JWT:** Hệ thống xác thực người dùng bằng JSON Web Token (JWT) và mã hóa mật khẩu với `bcryptjs`.
- **Bảo vệ tài nguyên:** Sử dụng `express-rate-limit` để giới hạn tần suất gửi yêu cầu chạy code, chống spam và tấn công DDOS.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, React Router DOM, Monaco Editor React, Axios, Vanilla CSS, Lucide React (Icons).
- **Backend:** Node.js, Express.js, Mongoose, JSONWebToken, BcryptJS.
- **Database:** MongoDB.
- **System Requirements:** Cần cài đặt sẵn trình biên dịch `javac/java` (dành cho Java) và `g++` (dành cho C++) trên máy host.

---

## 🚀 Hướng dẫn cài đặt và khởi chạy (Localhost)

### 1. Yêu cầu hệ thống (Prerequisites)
Trước khi khởi chạy dự án, hãy đảm bảo máy tính của bạn đã được cài đặt:
1. **Node.js** (Phiên bản 18+).
2. **MongoDB** (Cài đặt MongoDB Compass/Server ở cổng mặc định `27017` hoặc cập nhật chuỗi kết nối trong file `.env`).
3. **Trình biên dịch Java:** Cài đặt JDK và đảm bảo lệnh `java` và `javac` đã được thêm vào System Environment Variables (PATH).
4. **Trình biên dịch C++:** Cài đặt MinGW (trên Windows) hoặc GCC và đảm bảo lệnh `g++` đã được thêm vào System Environment Variables (PATH).

### 2. Thiết lập Backend
Mở Terminal / Command Prompt và chạy các lệnh sau:

```bash
# 1. Di chuyển vào thư mục backend
cd server

# 2. Cài đặt các thư viện Node.js cần thiết
npm install

# 3. Tạo dữ liệu bài học và bài tập mẫu vào Database
npm run seed

# 4. Khởi động API Server (chạy trên cổng 5000)
npm run dev
```
*(Lưu ý: Mật khẩu JWT và Mongo URI đã được cấu hình mặc định trong file `server/.env`)*

### 3. Thiết lập Frontend
Mở một cửa sổ Terminal / Command Prompt **mới** và chạy các lệnh sau:

```bash
# 1. Di chuyển vào thư mục frontend
cd client

# 2. Cài đặt các gói phụ thuộc cho React
npm install

# 3. Khởi động Web App
npm run dev
```
*(Web App sẽ tự động khởi chạy và có thể truy cập tại: `http://localhost:3000`)*

---

## ☁️ Hướng dẫn Đẩy lên Cloud (Deploy)

Để đưa nền tảng này lên Internet cho mọi người cùng sử dụng, bạn cần thực hiện 3 bước chính sau:

### Bước 1: Chuẩn bị Cơ sở dữ liệu (MongoDB Atlas)
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) và tạo một Project/Cluster miễn phí.
2. Tạo một Database User (ghi nhớ Username và Password).
3. Trong mục **Network Access**, thêm IP `0.0.0.0/0` để cho phép server truy cập từ mọi nơi.
4. Lấy chuỗi kết nối (Connection String) dạng `mongodb+srv://...` thay vào biến `MONGO_URI` trong file `.env` của Backend.

### Bước 2: Deploy Backend (Gợi ý dùng Render.com hoặc Railway)
1. Đẩy toàn bộ mã nguồn lên một repository trên Github.
2. Đăng nhập vào [Render.com](https://render.com), chọn **New Web Service**.
3. Kết nối với Github repo của bạn. 
4. Thiết lập cho Backend:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (Nhớ cập nhật file `package.json` của server thêm `"start": "node index.js"` nếu chưa có).
   - **Environment Variables**: Thêm `MONGO_URI` (chuỗi kết nối MongoDB Atlas) và `JWT_SECRET` (một chuỗi bảo mật bất kỳ).
5. Sau khi deploy thành công, Render sẽ cung cấp cho bạn một URL (ví dụ: `https://codecamp-backend.onrender.com`).

### Bước 3: Deploy Frontend (Gợi ý dùng Vercel hoặc Netlify)
1. Trước khi deploy, hãy mở file `client/src/api/index.js` và thay đổi `baseURL` thành URL Backend của Render vừa có ở Bước 2.
2. Đăng nhập vào [Vercel](https://vercel.com), chọn **Add New Project** và kết nối repo Github.
3. Cấu hình cho Frontend:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Nhấn Deploy và chờ đợi. Vercel sẽ cấp cho bạn đường link website hoàn chỉnh.

*(Lưu ý: Tính năng Code Runner chạy qua `child_process` gọi trực tiếp `java`/`g++`. Một số dịch vụ PaaS như Render/Railway có thể môi trường ảo của họ không cài sẵn trình biên dịch C++ hoặc Java. Để chạy thực tế trên production mượt mà, bạn nên dùng Docker/VPS (như DigitalOcean, AWS EC2) cài đặt sẵn các ngôn ngữ này, thay vì các dịch vụ PaaS tĩnh).*

---

## 📂 Cấu trúc thư mục

Dự án được phân chia thành 2 thư mục chính là `client` và `server`.

```text
codecamp/
├── client/                     # Thư mục chứa mã nguồn Frontend
│   ├── src/
│   │   ├── api/                # Cấu hình Axios & Token
│   │   ├── components/         # Các mảnh UI dùng chung (IDEPanel, Navbar...)
│   │   ├── context/            # Quản lý Global State (AuthContext)
│   │   ├── pages/              # Trang giao diện chính (Login, Dashboard...)
│   │   ├── App.jsx             # Root Component & Routes
│   │   └── index.css           # Định nghĩa CSS Core, Color Variables
│   ├── index.html              # HTML Entry Point
│   └── vite.config.js          # File cấu hình Vite
│
├── server/                     # Thư mục chứa mã nguồn Backend
│   ├── middleware/             # Xử lý trung gian (xác thực Token JWT)
│   ├── models/                 # MongoDB Schemas (User, Topic, Exercise...)
│   ├── routes/                 # Định nghĩa các endpoints API (RESTful)
│   ├── services/               # Logic xử lý nghiệp vụ (codeRunner.js)
│   ├── index.js                # Server Entry Point
│   ├── seed.js                 # Script đổ dữ liệu mẫu vào Database
│   └── .env                    # Lưu trữ các biến môi trường cấu hình
│
└── README.md                   # Tài liệu mô tả dự án
```

## 📖 Hướng dẫn sử dụng (User Guide)

### 1. Đăng ký & Đăng nhập
- Lần đầu truy cập ứng dụng (`http://localhost:3000/login`), hãy nhấn vào **Đăng ký ngay** để tạo tài khoản học tập.
- Nếu bạn nhập mật khẩu dưới 6 ký tự hoặc trùng tên, hệ thống sẽ báo lỗi trực quan.
- Sau khi đăng nhập thành công, bạn sẽ được tự động chuyển hướng đến trang **Dashboard**.

### 2. Màn hình Dashboard (Giao diện học tập chính)
Màn hình được chia làm 3 khu vực chính:
- **Cột Trái (Lộ trình học):** Cung cấp nút chuyển đổi giữa hai ngôn ngữ là `Java` và `C++`. Bên dưới là các Topic (chủ đề) sắp xếp từ cơ bản đến nâng cao. Nhấn vào một bài học để xem lý thuyết.
- **Cột Giữa (Lý thuyết / Đề bài):** 
  - Mặc định sẽ hiển thị Lý thuyết nội dung bài học cùng danh sách các Bài tập thực hành của phần đó.
  - Mỗi bài tập sẽ hiển thị thẻ nguồn (ví dụ: LeetCode màu vàng, HackerRank màu xanh) và độ khó. 
  - Khi click chọn 1 bài tập, cột này sẽ chuyển sang hiển thị **Chi tiết Đề bài** bao gồm Mô tả, Thẻ (Tags), và các Test Case mẫu (Input / Expected Output).
- **Cột Phải (Trình soạn thảo Code IDE):** 
  - Một trình soạn thảo code thông minh y hệt VS Code đã được thiết lập sẵn mã nguồn mẫu (Starter Code). 
  - Nơi đây có tích hợp tính năng tự động thụt lề, đổi màu từ khóa giúp bạn lập trình dễ dàng.

### 3. Cách chạy thử và nộp bài
- **Nút "Chạy thử" (Play):** Nhấn nút này để chạy biên dịch code của bạn với dữ liệu đầu vào (Input) từ Test case đầu tiên của bài. Kết quả (bao gồm lỗi cú pháp hoặc output) sẽ được hiển thị ngay lập tức trong bảng **Console Output** phía dưới IDE. Lệnh này không được tính vào lịch sử chấm điểm.
- **Nút "Nộp bài" (Send):** Khi bạn chắc chắn bài làm của mình đã ổn, hãy nhấn "Nộp bài". Lúc này:
  - Code của bạn sẽ được chạy qua *toàn bộ Test Cases ẩn* trên Server.
  - Kết quả từng Test Case sẽ hiện lên rõ ràng là `✅ Pass` hay `❌ Fail`.
  - Nếu tất cả các test case đều đúng (Accepted), bạn sẽ nhận được thông báo chúc mừng và **được cộng điểm thưởng** tương ứng với độ khó của bài tập.

### 4. Bảng xếp hạng (Leaderboard)
- Sau khi có điểm thưởng từ việc nộp bài thành công, bạn hãy bấm vào tab **Bảng xếp hạng** trên thanh Navbar (thanh điều hướng trên cùng).
- Tại đây, hệ thống hiển thị Top 50 người có điểm số cao nhất nền tảng, cập nhật theo thời gian thực (Real-time). Hãy cố gắng lọt vào Top 3 để có biểu tượng Huy chương Vàng, Bạc, Đồng nhé!

---

## 💡 Ghi chú dành cho nhà phát triển
- Khi chấm điểm, quá trình chạy code C++ có thể tạo ra các file thực thi (như `main.exe` hoặc tệp nhị phân). Hệ thống backend đã được thiết lập để tự dọn dẹp các tệp tạm trong thư mục `os.tmpdir()` sau khi trả kết quả về cho client.
- Nếu bạn gặp lỗi khi biên dịch C++ hoặc Java, hãy mở Terminal kiểm tra xem đã cấu hình PATH chính xác cho `g++` hoặc `javac` chưa bằng cách gõ `g++ --version` hoặc `javac -version`.
