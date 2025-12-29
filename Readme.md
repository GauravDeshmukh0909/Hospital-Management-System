# 🏥 Hospital Management System (MERN Stack)

A full-stack Hospital Management System with role-based access for Admin and Doctor.

**✅ All Tasks Completed** - Admin & Doctor Panel with Today's Patient Management

---

## 🛠️ Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Auth:** JWT + bcrypt

---

## 🔧 Setup

### Backend
```bash
cd backend
npm install
npm run dev  # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

---

## 🔐 Default Login Credentials

### Admin
```
Email: admin@hospital.com
Password: admin123
```

### Doctor
```
Email: gaurav@hospital.com
Password: 123456
```

---

## ✨ Features

### Admin Panel
- Manage Doctors (Add, View)
- Manage Medicines (Add, View)
- Register Patients for Today's OPD
- View All Patients

### Doctor Panel
- View Today's Patients Only
- Patient Details & Complaints
- Issue Prescriptions (Multiple Medicines)
- View Prescription History

---

## 📝 Notes

- JWT authentication for Admin & Doctor
- Role-based access control
- Sample `.env.type.txt` files included
- Update MongoDB URI before running
