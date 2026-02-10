# API Contract – Online Bimbel & Tryout Platform

Dokumen ini adalah **API Contract resmi** antara Backend dan Frontend.

Artinya:
- Struktur request & response **tidak boleh diubah sepihak**
- Perubahan contract harus melalui diskusi backend ↔ frontend
- Frontend **tidak perlu membaca source code backend**

---

## Base URL

```
/api
```

---

## Authentication

### Header Wajib (Protected Endpoint)

```
Authorization: Bearer <JWT_TOKEN>
```

Jika token tidak valid / tidak ada:

```json
{
  "message": "Unauthorized"
}
```

---

## 1. AUTH

### Register

**POST** `/auth/register`

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "message": "User registered"
}
```

---

### Login

**POST** `/auth/login`

Request Body:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "accessToken": "jwt_token_string"
}
```

---

## 2. COURSE

### Get All Courses

**GET** `/courses`

Response:
```json
[
  {
    "id": 1,
    "title": "UTBK",
    "description": "Persiapan UTBK",
    "created_at": "2026-02-05T10:00:00Z"
  }
]
```

---

### Create Course

**POST** `/courses`

Request Body:
```json
{
  "title": "string",
  "description": "string"
}
```

Response:
```json
{
  "id": 1,
  "title": "string"
}
```

---

## 3. MATERIAL

### Get Materials by Course

**GET** `materials/courses/:courseId`

Response:
```json
[
  {
    "id": 10,
    "title": "Logika Dasar",
    "content": "text",
    "video_url": "https://youtube.com/..."
  }
]
```

---

### Create Material

**POST** `/materials`

Request Body:
```json
{
  "course_id": 1,
  "title": "string",
  "content": "string",
  "video_url": "string | null"
}
```

Response:
```json
{
  "id": 10,
  "title": "string"
}
```

---

## 4. TRYOUT

### Get Tryouts by Course

**GET** `/tryouts/course/:courseId`

Response:
```json
[
  {
    "id": 3,
    "title": "Tryout 1",
    "description": "Latihan",
    "duration_minutes": 90
  }
]
```

---

### Start Tryout

**POST** `/tryouts/:tryoutId/start`

Response:
```json
{
  "attemptId": "uuid",
  "startedAt": "2026-02-05T10:00:00Z",
  "durationMinutes": 90
}
```

Rules:
- Jika masih ada attempt aktif → error

---

## 5. ATTEMPT (UJIAN BERJALAN)

### Get Current Question

**GET** `/attempts/:attemptId/question`

Response:
```json
{
  "questionId": 12,
  "text": "Isi soal",
  "options": [
    { "id": 1, "text": "A" },
    { "id": 2, "text": "B" }
  ]
}
```

---

### Save Answer

**POST** `/attempts/:attemptId/answer`

Request Body:
```json
{
  "questionId": 12,
  "optionId": 2
}
```

Response:
```json
{
  "status": "saved"
}
```

---

### Remaining Time

**GET** `/attempts/:attemptId/remaining-time`

Response:
```json
{
  "remainingSeconds": 812
}
```

---

### Submit Attempt

**POST** `/attempts/:attemptId/submit`

Response:
```json
{
  "message": "submitted",
  "score": 75
}
```

---

### Get Result

**GET** `/attempts/:attemptId/result`

Response:
```json
{
  "score": 75,
  "totalQuestions": 40,
  "correctAnswers": 30,
  "details": [
    {
      "question": "Soal...",
      "userAnswer": "B",
      "correctAnswer": "C",
      "explanation": "Penjelasan",
      "video_url": "https://youtube.com/..."
    }
  ]
}
```

---

## 6. Global Rules

- Backend adalah source of truth
- Frontend tidak menghitung skor
- Frontend tidak mengatur timer
- Semua validasi dilakukan backend

---

## 7. Error Format (Global)

```json
{
  "message": "Error description"
}
```

---

## 8. Contract Stability

- Penambahan field → diperbolehkan
- Menghapus / rename field → BREAKING CHANGE
- Semua perubahan harus update dokumen ini

---

## 9. Status

API Contract ini digunakan untuk:
- Web frontend
- Mobile app (future)
- QA testing

---

**END OF API CONTRACT**

