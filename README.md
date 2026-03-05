# 🎫 Smart Queue Management System

A full-stack queue management system with real-time updates and analytics.

## 🚀 Features

- 🔐 JWT Authentication (Admin/Customer roles)
- 🎫 FIFO Queue Management
- ⚡ Real-Time WebSocket Updates
- 📊 Analytics Dashboard
- 👥 User Management

## 🛠️ Tech Stack

**Backend:** Spring Boot, MySQL, WebSocket, JWT  
**Frontend:** Next.js, TypeScript, Tailwind CSS, Recharts

## 📸 Screenshots

### Admin Dashboard
![Dashboard](screenshots/admin-dashboard-1.png)
![Dashboard](screenshots/admin-dashboard-2.png)

### Queue Management
![Queue](screenshots/queue.png)

### Analytics
![Analytics](screenshots/analytic-1.png)
![Analytics](screenshots/analytic-2.png)

### Customer Ticket View
![Customer](screenshots/customer-ticket.png)

## 🚀 Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8084
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```
### Docker

mvn clean package -DskipTests
docker-compose down -v
docker-compose up --build

## 📝 Default Login

**Admin:**  
Email: `admin@example.com`  
Password: `admin123`

**Customer:**  
Email: `customer@example.com`  
Password: `customer123`

## 📂 Project Structure
```
smart-queue-management/
├── backend/          # Spring Boot API
└── frontend/         # Next.js App
```

## 📄 License

MIT License
