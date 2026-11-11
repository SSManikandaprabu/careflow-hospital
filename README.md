# 🏥 CareFlow™ — Intelligent Clinical Workflow & Real-Time Patient Queue Orchestration

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2563eb?style=for-the-badge&logo=github)](https://ssmanikandaprabu.github.io/careflow-hospital/)
[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **CareFlow** bridges the communication divide between outpatients, clinical staff, and hospital administration through real-time queue orchestration, dynamic doctor scheduling, live consultation desks, and instant room-call notifications.

---

## 📌 Executive Summary

Modern hospitals suffer from unpredictable triage congestion, high patient anxiety, and administrative blind spots. **CareFlow** solves this with an end-to-end clinical workflow suite featuring:
- **Zero-Wait In-Person & Virtual Token Issuance** with live ETA predictions.
- **Dedicated Doctor Consultation Cockpit** with electronic health record (EHR) entry, prescription PDF generation, and patient vitals tracking.
- **Bi-directional WebSocket Engine** (`Socket.io`) broadcasting room calls, doctor status changes, and audio chime alerts in real time.
- **Administrative Command Center** aggregating department queues, throughput metrics, and staff availability.

---

## ✨ Key Features

### 1. 🛡️ Role-Based Access Control (RBAC) & Security
- **3 Dedicated Workspaces:** Tailored views for **Patients**, **Doctors**, and **Administrators**.
- **Auth & Validation:** Signed JSON Web Tokens (`jsonwebtoken`), password hashing via `bcryptjs`, and schema validation with `zod`.

### 2. 🗓️ Smart Doctor Discovery & Appointment Booking
- Filter specialists by clinical department (Cardiology, Pediatrics, Orthopedics, Neurology, etc.), consultation room, and live availability.
- Slot booking engine preventing double-booked appointments.

### 3. ⚡ Real-Time WebSocket Queue Management (Socket.io)
- **Automated Prefix Tokens:** Department-specific identifiers (e.g., `CARD-001`, `PED-003`).
- **Dynamic ETA Engine:** Estimates wait times from active queue length and rolling consultation durations:
  $$\text{ETA} = N_{\text{patients ahead}} \times \overline{T}_{\text{consultation}}$$
- **Live Room Call Alerts:** Visual banner & audio alert when a doctor calls the next patient.

### 4. 🩺 Physician Consultation Desk (EHR)
- Interactive queue controls: *Call Next Patient*, *Start Consultation*, *Skip / No-Show*.
- Electronic clinical documentation: diagnosis summary, multi-drug digital prescriptions (`jsPDF`), and patient vitals tracking.

### 5. 📊 Hospital Operations & Telemetry Dashboard
- Live operational overview across hospital departments, active token queues, completed consultations, and doctor status toggles.

---

## 📂 Project Structure

```text
careflow-hospital/
├── client/          # React 19 + Vite + Tailwind CSS + Socket.io-client + jsPDF
├── server/          # Node.js + Express + TypeScript + Prisma + PostgreSQL + Socket.io
├── render.yaml      # Render deployment blueprint
└── README.md
```

---

## 🚀 Run Locally

### 1. Backend (`server/`)

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

### 2. Frontend (`client/`)

```bash
cd client
npm install
npm run dev
```

---

## 👤 Author

**S.S. Manikanda Prabu** (`@SSManikandaprabu`)  
- 🌐 Live Demo: [ssmanikandaprabu.github.io/careflow-hospital](https://ssmanikandaprabu.github.io/careflow-hospital/)
- 🛠 GitHub: [SSManikandaprabu](https://github.com/SSManikandaprabu)
