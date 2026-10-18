# careflow-hospital
# 🏥 CareFlow™ — Intelligent Clinical Workflow & Real-Time Patient Queue Orchestration

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015%20(React%2019)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.io-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> **CareFlow** bridges the communication divide between outpatients, clinical staff, and hospital administration through real-time queue orchestration, dynamic doctor scheduling, live tele-consultation desks, and instant emergency broadcast dispatches.

---

## 📌 Executive Summary

Modern hospitals suffer from unpredictable triage congestion, high patient anxiety, and administrative blind spots. **CareFlow** solves this with an end-to-end clinical workflow suite featuring:
- **Zero-Wait In-Person & Virtual Token Issuance** with live ETA predictions.
- **Dedicated Doctor Consultation Cockpit** with electronic health record (EHR) entry, prescription generator, and patient vitals tracking.
- **Bi-directional WebSocket Engine** that broadcasts room calls, doctor status changes, and audio chime alerts in under 40 milliseconds.
- **Administrative Command Center** aggregating real-time throughput metrics, congestion bottlenecks, and department staff capacities.

---

## ✨ Key Features

### 1. 🛡️ Role-Based Access Control (RBAC) & Security
- **3 Dedicated Workspaces**: Custom workflows tailored for **Patients**, **Attending Doctors**, and **Hospital Administrators**.
- **Industry Standard Auth**: Signed JSON Web Tokens (JWT) stored in HTTP-only cookies, salted password hashing via `bcrypt`, and request body sanitization with `Zod`.

### 2. 🗓️ Smart Doctor Discovery & Appointment Booking
- Filter specialists by clinical department (Cardiology, Pediatrics, Orthopedics, Neurology, etc.), consultation room, and real-time availability.
- Interactive 15-minute slot allocation engine with concurrency lockouts to prevent double-booking.

### 3. ⚡ Real-Time WebSocket Queue Management (Socket.io)
- **Automated Prefix Tokens**: Generates department-specific identifiers (e.g. `CARD-001`, `PED-003`).
- **Dynamic ETA Engine**: Computes wait time based on active queue length and rolling average consultation durations:
  $$\text{ETA} = N_{\text{patients ahead}} \times \overline{T}_{\text{consultation}}$$
- **Live Room Call Chime**: Audio ding & banner flash when the doctor triggers *"Call Next Patient"*.

### 4. 🩺 Physician Consultation Desk (EHR)
- Interactive patient queue list: *"Call Patient"*, *"Start Consultation"*, *"Skip / No-Show"*.
- Integrated electronic clinical documentation:
  - Diagnosis summary & symptoms.
  - Multi-drug digital prescription builder (Dosage, Frequency, Duration).
  - Patient vitals tracker (Blood Pressure, Heart Rate, SpO2, Temperature, Weight).

### 5. 📊 Hospital Operations & Telemetry Dashboard
- Live operational
