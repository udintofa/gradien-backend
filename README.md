# Backend API Documentation – Online Bimbel & Tryout Platform

## 1. Overview

Backend ini merupakan sistem untuk **platform bimbel online** yang memiliki dua fitur utama:

1. **Kursus / Materi Pembelajaran**
2. **Tryout (ujian online berbasis CBT)**

Backend dirancang agar:
- Aman (JWT-based authentication)
- Stateless
- Frontend-agnostic (bisa dipakai Web / Mobile)
- Backend sebagai **single source of truth**

---

## 2. Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MySQL
- Authentication: JWT
- Password Hashing: bcrypt

---

## 3. High-Level Architecture

```
User
 ↓
Frontend (React / Web / Mobile)
 ↓ REST API
Backend (Express)
 ↓
MySQL Database
```

---

## 4. Authentication

### Konsep
- User login menggunakan **username & password**
- Backend mengeluarkan **JWT access token**
- Semua endpoint protected membutuhkan header:

```
Authorization: Bearer <access_token>
```

### Catatan Penting
- Frontend **tidak boleh** menentukan logic bisnis dari token
- Backend tetap menjadi sumber kebenaran

---

## 5. Database Concept (Ringkas)

### Entitas Utama

- users
- courses
- materials
- tryouts
- questions
- options
- attempts
- answers

Relasi besar:

```
User → Attempt → Answer → Question → Tryout → Course
Course → Material
```

---

## 6. Course & Material Flow

### Course
Course merepresentasikan **paket belajar** (contoh: UTBK, SMA Kelas 12).

### Material
Material adalah konten pembelajaran di dalam course.

Properti material:
- text content
- optional video_url (YouTube embed)

### Flow
1. Frontend fetch list course
2. User memilih course
3. Frontend fetch material berdasarkan course
4. User membaca / menonton materi

> Backend **belum** melakukan tracking progress belajar.

---

## 7. Tryout Concept

### Definisi
Tryout adalah ujian online berbatas waktu yang berada di dalam satu course.

Tryout memiliki:
- title
- description
- duration_minutes
- kumpulan soal

### Aturan
- Satu tryout hanya bisa dikerjakan **1 attempt aktif** per user
- Timer dikontrol sepenuhnya oleh backend

---

## 8. Attempt (Sesi Ujian)

### Apa itu Attempt?
Attempt adalah **satu sesi pengerjaan tryout oleh satu user**.

Attempt menyimpan:
- user_id
- tryout_id
- started_at
- submitted_at
- score

### Rules
- User tidak bisa memulai attempt baru jika masih ada attempt aktif
- Refresh halaman tidak menghilangkan progress
- Jawaban disimpan per soal

---

## 9. Timer System (Backend Driven)

### Konsep
Timer **tidak disimpan di frontend**.

Backend menghitung sisa waktu berdasarkan:

```
remaining_time = started_at + duration_minutes - now
```

### Konsekuensi
- Frontend hanya menampilkan countdown
- Backend menentukan kapan attempt selesai
- Jika waktu habis, backend auto-submit attempt

---

## 10. Tryout Flow (Step-by-Step)

1. User login
2. User memilih course
3. User memilih tryout
4. User klik **Mulai Tryout**
5. Backend membuat attempt
6. Frontend mengambil soal satu per satu
7. User menjawab soal
8. Jawaban dikirim ke backend per soal
9. Waktu habis / submit manual
10. Backend menghitung skor
11. Frontend menampilkan hasil

---

## 11. One Page – One Question Strategy

### Alasan
- Autosave lebih aman
- Cocok untuk CBT
- Mudah resume

### Implementasi
- Satu endpoint untuk ambil satu soal
- Satu endpoint untuk simpan jawaban

---

## 12. API Endpoints

### Auth
| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

---

### Course
| Method | Endpoint | Description |
|------|--------|------------|
| GET | /api/courses | List course |
| POST | /api/courses | Create course |
| GET | /api/courses/:id | Detail course |
| PUT | /api/courses/:id | Update course |
| DELETE | /api/courses/:id | Delete course |

---

### Material
| Method | Endpoint | Description |
|------|--------|------------|
| GET | /api/courses/:id/materials | List material |
| POST | /api/materials | Create material |
| PUT | /api/materials/:id | Update material |
| DELETE | /api/materials/:id | Delete material |

---

### Tryout
| Method | Endpoint | Description |
|------|--------|------------|
| GET | /api/tryouts/course/:courseId | List tryout |
| POST | /api/tryouts | Create tryout |

---

### Attempt & Exam
| Method | Endpoint | Description |
|------|--------|------------|
| POST | /api/tryouts/:id/start | Start tryout |
| GET | /api/attempts/:id/question | Get current question |
| POST | /api/attempts/:id/answer | Save answer |
| GET | /api/attempts/:id/remaining-time | Remaining time |
| POST | /api/attempts/:id/submit | Submit attempt |
| GET | /api/attempts/:id/result | Tryout result |

---

## 13. Result & Review

Result berisi:
- total soal
- jawaban benar
- skor
- detail jawaban
- explanation
- video_url (jika ada)

Frontend dapat menggunakan data ini untuk:
- review soal
- pembahasan
- video penjelasan

---

## 14. Security Notes

- Semua endpoint penting wajib JWT
- User hanya bisa mengakses attempt miliknya
- Backend memvalidasi status attempt

---

## 15. Status Project

Backend saat ini berada pada tahap:

> **MVP – Production Ready Backend (Early Stage)**

Fitur lanjutan yang bisa ditambahkan:
- Role admin
- Progress belajar
- Ranking & analytics
- Unlock materi bertahap
- Google OAuth

---

## 16. Closing

Dokumentasi ini bertujuan agar:
- Frontend developer dapat bekerja **tanpa membaca source code backend**
- Sistem mudah dikembangkan
- Backend & frontend terpisah dengan jelas

---

Jika ada perubahan skema atau flow, dokumentasi ini **wajib diperbarui**.

