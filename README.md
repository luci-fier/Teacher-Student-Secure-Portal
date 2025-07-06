# Teacher-Student Secure Portal

An advanced web platform engineered for secure, seamless, and efficient file sharing between teachers and students. This project empowers educators to distribute digital materials, manage their content, and monitor resource usage, while students can easily access, download, and interact with shared learning resources in a protected environment.

---

## 🌟 Features

- **Secure File Sharing**: Teachers can upload educational files, and students can download them with authentication.
- **Role-Based Dashboards**: Separate, intuitive dashboards for both teachers and students.
- **File Protection**: Optional watermarking and file status indicators (Protected/Standard).
- **Personal Vault**: Teachers can manage their private educational materials.
- **Stats & Tracking**: Teachers can view file upload stats and download analytics.
- **Modern UI**: Built using React and Material UI for a responsive, elegant experience.
- **Authentication**: JWT-based authentication for secure access control.
- **Error Handling & Notifications**: Friendly notifications and robust error handling for all users.

---

## 🚀 Demo

- Teacher Dashboard: Manage and track your educational materials, upload new files, and view download statistics.
- Student Dashboard: Browse and download your learning materials securely.

---

## 🛠️ Project Structure

```
Teacher-Student-Secure-Portal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TeacherFileManager.js
│   │   │   ├── FileDownload.js
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── TeacherDashboard.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── ...
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── (Express.js/Node.js server and API logic)
│   └── ...
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the repository

```sh
git clone https://github.com/luci-fier/Teacher-Student-Secure-Portal.git
cd Teacher-Student-Secure-Portal
```

### 2. Install dependencies

#### For the Frontend
```sh
cd frontend
npm install
```

#### For the Backend
```sh
cd ../backend
npm install
```

### 3. Environment Variables

- Set up your `.env` files as required for backend (API keys, database URLs, JWT secrets, etc.).

### 4. Run the Application

#### Start the Backend Server

```sh
npm start
```
Backend will typically run on [http://localhost:3000](http://localhost:3000).

#### Start the Frontend

In a new terminal:

```sh
cd frontend
npm start
```
Frontend will run on [http://localhost:3001](http://localhost:3001) (or as configured).

---

## 🎯 Usage

- **Teachers**: Log in to upload, manage, and track educational files.
- **Students**: Log in to access and download shared files.
- **Download Protection**: Files marked as "Protected" have watermarking or enhanced security.

---

## 🤝 Collaborators

- [luci-fier](https://github.com/luci-fier)
- [bikrant07](https://github.com/bikrant07)
- [Gungunkhaitan](https://github.com/Gungunkhaitan)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---
---
