# Coffee Health Backend API Documentation

## Base URL

```txt
http://localhost:5000
```

---

# Authentication

## Register User

### Endpoint

```http
POST /api/auth/register
```

### Request Body

```json
{
  "name": "Saeful Rizal",
  "email": "saeful@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Saeful Rizal",
      "email": "saeful@example.com"
    },
    "token": "jwt_token"
  }
}
```

---

## Login User

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "saeful@example.com",
  "password": "123456"
}
```

### Success Response

```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 1,
      "name": "Saeful Rizal",
      "email": "saeful@example.com"
    },
    "token": "jwt_token"
  }
}
```

---

## Get Current User

### Endpoint

```http
GET /api/auth/me
```

### Headers

```txt
Authorization: Bearer jwt_token
```

### Success Response

```json
{
  "status": "success",
  "message": "Data user berhasil diambil",
  "data": {
    "user": {
      "id": 1,
      "name": "Saeful Rizal",
      "email": "saeful@example.com"
    }
  }
}
```

---

# Metadata

## Get Metadata Form

### Endpoint

```http
GET /api/metadata
```

### Success Response

```json
{
  "status": "success",
  "message": "Metadata form berhasil diambil",
  "data": {
    "genderOptions": ["Male", "Female"],
    "sleepQualityOptions": ["Poor", "Fair", "Good", "Excellent"]
  }
}
```

---

# Prediction

## Create Prediction

### Endpoint

```http
POST /api/predictions
```

### Headers (Optional)

```txt
Authorization: Bearer jwt_token
```

### Request Body

```json
{
  "age": 21,
  "gender": "Male",
  "country": "Indonesia",
  "coffeeIntake": 4,
  "caffeineMg": 360,
  "sleepHours": 5,
  "sleepQuality": "Poor",
  "bmi": 24,
  "heartRate": 88,
  "physicalActivityHours": 1,
  "occupation": "Student"
}
```

---

## Guest Response

```json
{
  "status": "success",
  "message": "Prediksi berhasil dibuat",
  "data": {
    "id": null,
    "riskScore": 80,
    "riskCategory": "High",
    "stressLevel": "High",
    "healthStatus": "Severe",
    "isRecommendationLocked": true,
    "recommendation": "Login untuk melihat rekomendasi lengkap."
  }
}
```

---

## Logged In User Response

```json
{
  "status": "success",
  "message": "Prediksi berhasil dibuat",
  "data": {
    "id": 1,
    "riskScore": 80,
    "riskCategory": "High",
    "stressLevel": "High",
    "healthStatus": "Severe",
    "isRecommendationLocked": false,
    "recommendation": "Kurangi konsumsi kopi dan perbaiki kualitas tidur."
  }
}
```

---

## Get Prediction History

### Endpoint

```http
GET /api/predictions
```

### Headers

```txt
Authorization: Bearer jwt_token
```

### Success Response

```json
{
  "status": "success",
  "message": "Riwayat prediksi berhasil diambil",
  "data": []
}
```

---

## Get Prediction Detail

### Endpoint

```http
GET /api/predictions/:id
```

### Headers

```txt
Authorization: Bearer jwt_token
```

---

## Delete Prediction

### Endpoint

```http
DELETE /api/predictions/:id
```

### Headers

```txt
Authorization: Bearer jwt_token
```

---

# Health Check

## Health Endpoint

### Endpoint

```http
GET /api/health
```

### Success Response

```json
{
  "status": "success",
  "message": "Server is healthy"
}
```

---

# Error Response Format

```json
{
  "status": "error",
  "message": "Pesan error",
  "errors": null
}
```
