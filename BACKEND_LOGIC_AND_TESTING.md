# 📘 Backend Logic Building & JSON Testing Guide
**Project:** StayEase - Hostel & PG Management System  
**Tech Stack:** Java 17+, Spring Boot 4/3, Spring Data JPA, Jakarta Persistence, Maven, Postman  
**Base URL:** `http://localhost:8080/api`

---

## 📑 Table of Contents
1. [Backend Architectural Overview](#1-backend-architectural-overview)
2. [Data Transfer Objects (DTOs) vs Entities](#2-data-transfer-objects-dtos-vs-entities)
3. [Core Business Logic Workflows](#3-core-business-logic-workflows)
   - [Room Occupancy Lifecycle](#room-occupancy-lifecycle)
   - [Tenant Booking Application Lifecycle](#tenant-booking-application-lifecycle)
   - [Rent Payment Accounting Flow](#rent-payment-accounting-flow)
   - [Complaint Resolution Workflow](#complaint-resolution-workflow)
   - [Role-Based Authentication Engine](#role-based-authentication-engine)
4. [REST API Endpoints Reference](#4-rest-api-endpoints-reference)
5. [Complete JSON Testing Guide (Postman / cURL)](#5-complete-json-testing-guide-postman--curl)
   - [Authentication Endpoints](#auth-testing)
   - [Owner Management Endpoints](#owner-testing)
   - [Tenant Management Endpoints](#tenant-testing)
   - [Room Listing & Inventory Endpoints](#room-testing)
   - [Application & Approval Endpoints](#application-testing)
   - [Rent Tracking & Payment Endpoints](#rent-testing)
   - [Complaint Ticketing Endpoints](#complaint-testing)
6. [Automated End-to-End JSON Test Scenarios](#6-automated-end-to-end-json-test-scenarios)

---

## 1. Backend Architectural Overview

The backend follows an enterprise **Layered Controller-Service-Repository Pattern**:

```
Client (Postman / React SPA)
         │  HTTP / JSON
         ▼
┌──────────────────────────────────────────────┐
│             Controller Layer                 │
│  - Endpoint routing (@RequestMapping)        │
│  - HTTP Request deserialization & validation │
│  - Response status code mapping (ResponseEntity)
└──────────────────────┬───────────────────────┘
                       │ DTOs
                       ▼
┌──────────────────────────────────────────────┐
│              Service Layer                   │
│  - Core business logic execution             │
│  - State transitions & validations           │
│  - Entity <-> DTO bidirectional mapping      │
│  - Cross-service orchestration               │
│  - Database transaction management (@Transactional)
└──────────────────────┬───────────────────────┘
                       │ Entities
                       ▼
┌──────────────────────────────────────────────┐
│          Spring Data JPA Repository          │
│  - CRUD operations (JpaRepository)           │
│  - Derived query methods                     │
│  - Hibernate ORM SQL generation              │
└──────────────────────┬───────────────────────┘
                       │ SQL
                       ▼
┌──────────────────────────────────────────────┐
│            Database (MySQL / H2)             │
└──────────────────────────────────────────────┘
```

---

## 2. Data Transfer Objects (DTOs) vs Entities

To avoid tightly coupling database representations to API clients and prevent leaking sensitive data (like unhashed passwords), the system employs strict separation between **Entities** and **DTOs**:

| Entity | DTO | Purpose & Security Benefit |
| :--- | :--- | :--- |
| `OwnerEntity` | `OwnerDTO` | Masks passwords (`******`) in API responses; sanitizes input strings. |
| `TenantEntity` | `TenantDTO` | Tracks room assignments, rent status, and masks passwords. |
| `RoomEntity` | `RoomDTO` | Manages room capacity, rent amount, security deposit, and live occupant. |
| `TenantApplicationEntity` | `TenantApplicationDTO` | Encapsulates tenant's room booking proposal and approval status. |
| `RentPaymentEntity` | `RentPaymentDTO` | Formats transaction timestamps, payment channels, and receipt amounts. |
| `ComplaintEntity` | `ComplaintDTO` | Tracks tenant grievances, owner resolution notes, and status timestamps. |
| *None* | `AuthRequestDTO` & `AuthResponseDTO` | Dedicated credentials input and role-aware auth tokens/profiles. |

> **Null-Safety Design Note:** All numerical fields in DTOs utilize Java wrapper types (`Integer`, `Double`) instead of primitives (`int`, `double`). This eliminates `HttpMessageNotReadableException` when clients submit JSON payloads without auto-generated IDs.

---

## 3. Core Business Logic Workflows

### Room Occupancy Lifecycle

Rooms exist in one of three enumerated states:
- `AVAILABLE`: Can be browsed and booked by prospective or current tenants.
- `OCCUPIED`: Assigned to an active tenant. Cannot receive new applications.
- `UNDER_MAINTENANCE`: Withdrawn from public listings for renovations or cleaning.

```
 [ Room Created ] ──► AVAILABLE ──(Application Approved)──► OCCUPIED
                           ▲                                    │
                           │                                    │
                     (Tenant Vacates)                    (Tenant Vacates)
                           │                                    │
                           └─── UNDER_MAINTENANCE ◄─────────────┘
```

### Tenant Booking Application Lifecycle

1. **Submission (`POST /api/applications/apply`):**
   - System checks if `roomId` exists and has `status == "AVAILABLE"`.
   - If occupied or under maintenance, an `IllegalStateException` is thrown (HTTP 400).
   - Generates application with status `PENDING`.
2. **Approval (`PUT /api/applications/{id}/approve`):**
   - Atomically flips the Application status to `APPROVED`.
   - Updates target Room status to `OCCUPIED`, binding `currentTenantId` and `currentTenantName`.
   - Updates target Tenant record with `assignedRoomId`, `assignedRoomNumber`, and sets `rentStatus = "DUE"`.
3. **Rejection (`PUT /api/applications/{id}/reject`):**
   - Application status is marked `REJECTED`. Room remains `AVAILABLE`.

### Rent Payment Accounting Flow

1. **Submission (`POST /api/rent/pay`):**
   - Validates payment details (`tenantId`, `amount`, `paymentMethod`, `month`).
   - Generates a unique transaction identifier: `TXN-{timestamp}`.
   - Marks payment entity as `PAID`.
   - Updates tenant record's `rentStatus` to `PAID`.
2. **Analytics (`GET /api/rent/stats`):**
   - Computes total collected revenue (`SUM(amount)` for `PAID` payments).
   - Counts pending tenants where `rentStatus IN ('DUE', 'OVERDUE')`.
   - Returns real-time financial health metrics to the Owner dashboard.

### Complaint Resolution Workflow

1. **Creation (`POST /api/complaints`):**
   - Tenant logs grievance with category (`Plumbing`, `Wi-Fi`, `Electrical`, etc.) and priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
   - Status defaults to `OPEN`.
2. **Triage & Resolution (`PUT /api/complaints/{id}/status`):**
   - Owner updates status to `IN_PROGRESS` or `RESOLVED`.
   - Owner appends internal resolution notes.
   - System stamps `resolvedDate` upon transitioning to `RESOLVED`.

### Role-Based Authentication Engine

The `/api/auth/login` endpoint supports unified login for both user types:
- Examines credentials against `OwnerRepository` and `TenantRepository`.
- Optional `role` parameter (`OWNER` or `TENANT`) allows strict disambiguation.
- Returns `AuthResponseDTO` with authorized role, greeting message, and user profile.

---

## 4. REST API Endpoints Reference

| HTTP Method | Endpoint | Controller | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | `AuthController` | Authenticates Owner or Tenant |
| `POST` | `/api/auth/register-owner` | `AuthController` | Registers new Owner account |
| `POST` | `/api/auth/register-tenant` | `AuthController` | Registers new Tenant account |
| `GET` | `/api/owners` | `OwnerController` | List all owners |
| `GET` | `/api/owners/{id}` | `OwnerController` | Get owner by ID |
| `POST` | `/api/owners` | `OwnerController` | Create new owner |
| `PUT` | `/api/owners/{id}` | `OwnerController` | Update owner details |
| `DELETE` | `/api/owners/{id}` | `OwnerController` | Delete owner |
| `GET` | `/api/tenants` | `TenantController` | List all tenants |
| `GET` | `/api/tenants/{id}` | `TenantController` | Get tenant by ID |
| `POST` | `/api/tenants` | `TenantController` | Create new tenant |
| `PUT` | `/api/tenants/{id}` | `TenantController` | Update tenant details |
| `GET` | `/api/rooms` | `RoomController` | List all rooms |
| `GET` | `/api/rooms/available` | `RoomController` | List only available rooms |
| `GET` | `/api/rooms/{id}` | `RoomController` | Get room by ID |
| `POST` | `/api/rooms` | `RoomController` | Add a new room |
| `PUT` | `/api/rooms/{id}` | `RoomController` | Update room details |
| `DELETE` | `/api/rooms/{id}` | `RoomController` | Delete room |
| `POST` | `/api/applications/apply` | `ApplicationController` | Submit room booking application |
| `GET` | `/api/applications` | `ApplicationController` | List all applications (Owner) |
| `GET` | `/api/applications/tenant/{id}` | `ApplicationController` | List applications by tenant |
| `PUT` | `/api/applications/{id}/approve` | `ApplicationController` | Approve application & assign room |
| `PUT` | `/api/applications/{id}/reject` | `ApplicationController` | Reject application |
| `POST` | `/api/rent/pay` | `RentController` | Record digital rent payment |
| `GET` | `/api/rent/all` | `RentController` | List all rent payments (Owner) |
| `GET` | `/api/rent/tenant/{id}` | `RentController` | Get payments for a tenant |
| `GET` | `/api/rent/stats` | `RentController` | Get aggregate revenue stats |
| `POST` | `/api/complaints` | `ComplaintController` | File a new complaint (Tenant) |
| `GET` | `/api/complaints` | `ComplaintController` | List all complaints (Owner) |
| `GET` | `/api/complaints/tenant/{id}`| `ComplaintController` | List complaints by tenant |
| `PUT` | `/api/complaints/{id}/status` | `ComplaintController` | Update complaint status & notes |

---

## 5. Complete JSON Testing Guide (Postman / cURL)

<a id="auth-testing"></a>
### 🔐 1. Authentication Endpoints

#### 1.1 Owner Login
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "owner@hostel.com",
  "password": "password123",
  "role": "OWNER"
}
```
- **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Owner login successful! Welcome back, Vikram Malhotra",
  "role": "OWNER",
  "user": {
    "id": 1,
    "name": "Vikram Malhotra",
    "email": "owner@hostel.com",
    "phone": "+91 98765 43210",
    "password": "******",
    "hostelName": "Shree Sai Royal PG & Hostels",
    "address": "Plot 42, Knowledge Park III, Greater Noida"
  }
}
```

#### 1.2 Tenant Login
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "tenant@college.edu",
  "password": "password123",
  "role": "TENANT"
}
```
- **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Tenant login successful! Welcome, Rahul Sharma",
  "role": "TENANT",
  "user": {
    "id": 1,
    "name": "Rahul Sharma",
    "email": "tenant@college.edu",
    "phone": "+91 98111 22334",
    "password": "******",
    "collegeOrCompany": "Computer Science - Sem 5",
    "assignedRoomId": 102,
    "assignedRoomNumber": "B-201",
    "monthlyRent": 7500.0,
    "rentStatus": "PAID"
  }
}
```

#### 1.3 Register New Tenant
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/auth/register-tenant`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "Aman Verma",
  "email": "aman@college.edu",
  "phone": "+91 98333 44556",
  "password": "mypassword123",
  "collegeOrCompany": "Mechanical Engineering - Sem 3"
}
```
- **Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Tenant registered successfully!",
  "role": "TENANT",
  "user": {
    "id": 3,
    "name": "Aman Verma",
    "email": "aman@college.edu",
    "phone": "+91 98333 44556",
    "password": "******",
    "collegeOrCompany": "Mechanical Engineering - Sem 3",
    "assignedRoomId": null,
    "assignedRoomNumber": null,
    "monthlyRent": 0.0,
    "rentStatus": "DUE"
  }
}
```

---

<a id="room-testing"></a>
### 🛏️ 2. Room Listing & Inventory Endpoints

#### 2.1 Get All Available Rooms (Tenant Browsing)
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/rooms/available`
- **Expected Response (200 OK):**
```json
[
  {
    "id": 101,
    "roomNumber": "A-101",
    "roomType": "Single Sharing",
    "rentAmount": 9500.0,
    "securityDeposit": 10000.0,
    "status": "AVAILABLE",
    "amenities": "Attached Washroom, Air Conditioning, High-speed Wi-Fi, Study Desk, Balcony",
    "description": "Spacious premium single-sharing room on the 1st floor with ample natural sunlight.",
    "imageUrl": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
    "ownerId": 1,
    "currentTenantId": null,
    "currentTenantName": null
  }
]
```

#### 2.2 Add New Room (Owner)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/rooms`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "roomNumber": "E-501",
  "roomType": "Double Sharing",
  "rentAmount": 8200.0,
  "securityDeposit": 9000.0,
  "status": "AVAILABLE",
  "amenities": "Air Conditioning, Balcony, Wi-Fi, Geyser",
  "description": "Top floor double sharing room with panoramic terrace view.",
  "imageUrl": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
  "ownerId": 1
}
```
- **Expected Response (200 OK):**
```json
{
  "id": 107,
  "roomNumber": "E-501",
  "roomType": "Double Sharing",
  "rentAmount": 8200.0,
  "securityDeposit": 9000.0,
  "status": "AVAILABLE",
  "amenities": "Air Conditioning, Balcony, Wi-Fi, Geyser",
  "description": "Top floor double sharing room with panoramic terrace view.",
  "imageUrl": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
  "ownerId": 1,
  "currentTenantId": null,
  "currentTenantName": null
}
```

---

<a id="application-testing"></a>
### 📝 3. Room Application & 1-Click Approval

#### 3.1 Apply for a Room (Tenant)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/applications/apply`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "tenantEmail": "aman@college.edu",
  "tenantPhone": "+91 98333 44556",
  "roomId": 101,
  "message": "Interested in booking single room A-101 for Sem 3."
}
```
- **Expected Response (200 OK):**
```json
{
  "id": 103,
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "tenantEmail": "aman@college.edu",
  "tenantPhone": "+91 98333 44556",
  "roomId": 101,
  "roomNumber": "A-101",
  "rentAmount": 9500.0,
  "message": "Interested in booking single room A-101 for Sem 3.",
  "status": "PENDING",
  "applicationDate": "25 Oct 2026"
}
```

#### 3.2 Approve Application (Owner Action)
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/applications/103/approve`
- **Expected Response (200 OK):**
```json
{
  "id": 103,
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "tenantEmail": "aman@college.edu",
  "tenantPhone": "+91 98333 44556",
  "roomId": 101,
  "roomNumber": "A-101",
  "rentAmount": 9500.0,
  "message": "Interested in booking single room A-101 for Sem 3.",
  "status": "APPROVED",
  "applicationDate": "25 Oct 2026"
}
```
> **Backend Verification:** Now calling `GET /api/rooms/available` will NO LONGER return room `A-101`. Calling `GET /api/rooms/101` will show `status: "OCCUPIED"`, `currentTenantId: 3`, and `currentTenantName: "Aman Verma"`.

---

<a id="rent-testing"></a>
### 💳 4. Rent Tracking & Payment Endpoints

#### 4.1 Pay Rent (Tenant)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/rent/pay`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "roomId": 101,
  "roomNumber": "A-101",
  "amount": 9500.0,
  "month": "October 2026",
  "paymentMethod": "UPI"
}
```
- **Expected Response (200 OK):**
```json
{
  "id": 1004,
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "roomId": 101,
  "roomNumber": "A-101",
  "amount": 9500.0,
  "month": "October 2026",
  "paymentDate": "25 Oct 2026",
  "paymentMethod": "UPI",
  "transactionId": "TXN-7489201",
  "status": "PAID"
}
```

#### 4.2 Get Financial Analytics (Owner)
- **Method:** `GET`
- **URL:** `http://localhost:8080/api/rent/stats`
- **Expected Response (200 OK):**
```json
{
  "totalCollected": 31000.0,
  "totalPaymentsCount": 4,
  "totalPendingAmount": 6500.0,
  "pendingTenantsCount": 1
}
```

---

<a id="complaint-testing"></a>
### 🎫 5. Complaint Ticketing Endpoints

#### 5.1 File Complaint (Tenant)
- **Method:** `POST`
- **URL:** `http://localhost:8080/api/complaints`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "roomNumber": "A-101",
  "category": "Electrical",
  "title": "Study table socket not working",
  "description": "The laptop charging point near the study table is sparking and tripped the MCB.",
  "priority": "HIGH"
}
```
- **Expected Response (200 OK):**
```json
{
  "id": 503,
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "roomNumber": "A-101",
  "category": "Electrical",
  "title": "Study table socket not working",
  "description": "The laptop charging point near the study table is sparking and tripped the MCB.",
  "priority": "HIGH",
  "status": "OPEN",
  "ownerNotes": "",
  "createdDate": "25 Oct 2026",
  "resolvedDate": null
}
```

#### 5.2 Resolve Complaint (Owner)
- **Method:** `PUT`
- **URL:** `http://localhost:8080/api/complaints/503/status?status=RESOLVED&ownerNotes=Electrician%20replaced%2016A%20modular%20socket`
- **Expected Response (200 OK):**
```json
{
  "id": 503,
  "tenantId": 3,
  "tenantName": "Aman Verma",
  "roomNumber": "A-101",
  "category": "Electrical",
  "title": "Study table socket not working",
  "description": "The laptop charging point near the study table is sparking and tripped the MCB.",
  "priority": "HIGH",
  "status": "RESOLVED",
  "ownerNotes": "Electrician replaced 16A modular socket",
  "createdDate": "25 Oct 2026",
  "resolvedDate": "25 Oct 2026"
}
```

---

## 6. Automated End-to-End JSON Test Scenarios

To demonstrate the full lifecycle to your professor or during evaluation, execute this 6-step test flow sequentially in Postman:

1. **Step 1:** `POST /api/auth/register-tenant` ➔ Register tenant **Aman Verma**.
2. **Step 2:** `GET /api/rooms/available` ➔ Observe room **A-101** is listed as `AVAILABLE`.
3. **Step 3:** `POST /api/applications/apply` ➔ Tenant applies for **A-101**.
4. **Step 4:** `PUT /api/applications/{id}/approve` ➔ Owner approves the application.
5. **Step 5:** `GET /api/rooms/available` ➔ Confirm **A-101** is **automatically removed** from available rooms.
6. **Step 6:** `POST /api/rent/pay` ➔ Aman pays rent; verify `GET /api/rent/stats` updates aggregate revenue.
