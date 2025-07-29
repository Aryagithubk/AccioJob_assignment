
# 🚀 Project Setup Guide

This project contains two parts:

* **Frontend**: Developed using React.js
* **Backend**: Built with Node.js (Express)

---

## 📁 Folder Structure

```
project-root/
│
├── frontend/     # React frontend
└── backend/      # Node.js backend (Express)
```

---

## ⚙️ Requirements

Make sure the following are installed:

* [Node.js](https://nodejs.org/) (v16+ recommended)
* npm (comes with Node.js)
* Git (optional but useful)

---

## 🛠️ Backend Setup

### 📂 Navigate to the backend folder

```bash
cd backend
```

### 📦 Install dependencies

```bash
npm install
```

### ▶️ Run the server

```bash
node src/server.js
```

### ✅ If using `nodemon` (for development)

```bash
npx nodemon src/server.js
```

The server will start on the configured port (commonly `http://localhost:5000`).

---

## 🌐 Frontend Setup

### 📂 Navigate to the frontend folder

```bash
cd frontend
```

### 📦 Install dependencies

```bash
npm install
```

### ▶️ Start the frontend (React dev server)

Use one of the following:

```bash
npm start
# or
npm run dev
```

The frontend will typically run on `http://localhost:3000` or `5173` depending on the setup (React or Vite).

---

## 🔗 Connecting Frontend and Backend

Ensure the frontend makes requests to the correct backend URL.

### Example:

In frontend code (like `axios` or `fetch` calls), use:

```javascript
http://localhost:5000/api/your-endpoint
```

You can store this base URL in a `.env` file inside `frontend/`:

```
REACT_APP_API_URL=http://localhost:5000
```

Then use it in code:

```js
axios.get(`${process.env.REACT_APP_API_URL}/api/your-endpoint`);
```

---

## 🧪 Testing

* Open two terminals:

  * One for `backend`
  * One for `frontend`
* Make sure both servers are running simultaneously

---

## 📦 Build Frontend for Production

If you want to deploy:

```bash
cd frontend
npm run build
```


---

