<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:4facfe,100:00f2fe&height=200&section=header&text=Tool%20Media&fontSize=40&fontColor=ffffff"/>
</p>

<h1 align="center">🎬 Tool Media</h1>
<p align="center">
  <b>Fullstack Video Processing Platform (Node.js + FFmpeg + Vite)</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18-green?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/FFmpeg-Video-blue?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Vite-Frontend-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
</p>

---

## 🚀 Overview

**Tool Media** là một ứng dụng fullstack cho phép người dùng upload và xử lý video trực tiếp trên web.

Ứng dụng sử dụng **FFmpeg** để thực hiện các thao tác như:

* ✂️ Cắt video
* 🔗 Ghép video
* 📦 Xuất file media

👉 Được thiết kế theo hướng **thực tế (real-world system)** với xử lý bất đồng bộ và tách frontend/backend.

---

## 🎥 Demo

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3JqczJ2dDdpN2x5bGJ4eWZ2Y3V0bWc5N2JmY3p0YzF2a3NqN2J5ZyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7btPCcdNniyf0ArS/giphy.gif" width="600"/>
</p>

> 🔥 Lười

---

## ✨ Features

* 📤 Upload video
* ✂️ Cut video theo thời gian
* 🔗 Merge nhiều video
* ⚡ Xử lý bất đồng bộ (background jobs)
* 📁 Quản lý file upload & output

---

## 🛠️ Tech Stack

### 🔹 Backend

* Node.js
* Express.js
* FFmpeg

### 🔹 Frontend

* Vite
* JavaScript
* HTML / CSS

---

## 🧠 Architecture

```bash id="cbr8jf"
Client (Vite)
      ↓
API Server (Node.js)
      ↓
Job Queue (jobs.js)
      ↓
FFmpeg Processing
      ↓
Output Video
```

---

## 📁 Project Structure

```bash id="p0b2ju"
Tool_Media/
 ├── server/
 │   ├── src/
 │   │   ├── index.js
 │   │   ├── ffmpeg.js
 │   │   └── jobs.js
 │   ├── .gitignore
 │   ├── package-lock.json
 │   └── package.json
 │
 ├── web/
 │   ├── public/
 │   ├── src/
 │   │   ├── assets/
 │   │   ├── components/
 │   │   ├── pages/
 │   │   ├── App.jsx
 │   │   ├── api.js
 │   │   ├── main.jsx
 │   │   └── styles.css
 │   ├── .gitignore
 │   ├── README.md
 │   ├── eslint.config.js
 │   ├── index.html
 │   ├── package-lock.json
 │   ├── package.json
 │   └── vite.config.js
 │
 └── README.md
```

---

## ⚙️ Getting Started

### 1️⃣ Clone repo

```bash id="6r6z4z"
git clone https://github.com/Tunaanhgamedev/Tool_Media.git
```

---

### 2️⃣ Setup Backend

```bash id="q3bz84"
cd server
npm install
npm start
```

---

### 3️⃣ Setup Frontend

```bash id="7l1qhn"
cd web
npm install
npm run dev
```

---

### 4️⃣ Run

* Frontend: http://localhost:5173
* Backend: http://localhost:3000

---

## 📌 Requirements

* Node.js >= 16
* FFmpeg (installed & added to PATH)

---

## 🔌 API

```http id="q9h3rh"
POST /upload
POST /cut
POST /merge
GET  /status/:id
```

---

## 🚫 .gitignore

```bash id="lm7jqp"
node_modules/
uploads/
outputs/
*.mp4
```

---

## 💡 Highlights

* ⚡ Xử lý video với FFmpeg
* 🔄 Async processing tránh block server
* 🧱 Kiến trúc tách frontend/backend
* 📦 Hỗ trợ file lớn (>100MB local processing)

---

## 🚀 Future Improvements

* 🎯 Progress bar realtime
* ☁️ Cloud storage (AWS S3 / Cloudinary)
* 🔐 Authentication (JWT)
* ⚡ Queue system (Redis + Bull)

---

## 📸 Demo (Your Version)

👉 Lười

---

## 📄 License

MIT License

---

<p align="center">
  💻 Built with passion by Tuấn 🚀
</p>
