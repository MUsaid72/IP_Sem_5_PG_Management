# StayEase - Fullstack Hostel & PG Management System

> **IP Java Semester 5 Hands-on Project**  
> Built with **Java 21/26**, **Spring Boot 4 / 3**, **Apache Maven**, **REST API architecture**, and a **Modern Responsive Web UI**.

---

## 📌 Project Overview
StayEase is a complete fullstack digital Hostel and PG Management System. It allows hostel owners to list and manage rooms, track tenant applications and occupancy, manage monthly rental collections digitally, and resolve tenant complaints in real time.

### ✨ Core Features
1. **Dynamic Authentication & Registration**:
   - Register **unlimited new Tenants and new Owners** via Web UI or Postman.
   - Distinct **Owner** and **Tenant** dashboards.
   - Quick one-click demo login buttons for instant classroom demos.
2. **Room Management & Real-Time Availability**:
   - Owners can add rooms (Room #, Sharing Type, Monthly Rent, Security Deposit, Amenities, Image, Description).
   - Rooms added by the Owner immediately appear in the Tenant's room marketplace.
   - Status tracking: `AVAILABLE`, `OCCUPIED` (Unavailable), `UNDER_MAINTENANCE`.
3. **Tenant Application & Owner Approval Workflow**:
   - Tenants can browse available rooms and submit booking applications.
   - Owners review incoming applications and approve/reject with a single click.
   - **Automatic Status Transition**: Upon owner approval, the room is automatically assigned to the tenant and its status flips to `OCCUPIED` (unavailable in future tenant listings).
4. **Digital Monthly Rent Tracking**:
   - Tenants can view monthly rent dues and pay digitally (UPI, Net Banking, Card).
   - Generates digital receipts with transaction IDs.
   - Owners track all incoming rent payments and real-time revenue collection statistics.
5. **Complaint Ticketing Desk**:
   - Tenants can file grievances with categories (Plumbing, Electrical, Wi-Fi, Food/Mess, Cleanliness, Noise, Other) and urgency levels (`LOW`, `MEDIUM`, `HIGH`, `URGENT`).
   - Grievances appear instantly on the Owner Complaint Desk.
   - Owners can update status (`OPEN`, `IN_PROGRESS`, `RESOLVED`) and add resolution notes visible to the tenant.

---

## 🏛 Architecture & Code Structure
The backend follows the exact clean controller-service-entity-DTO pattern from your reference backend:

```
IP-Java-Sem5/
├── pom.xml                               # Maven project configuration
├── postman/
│   └── HostelManagement.postman_collection.json # Ready-to-import Postman Collection
├── src/
│   └── main/
│       ├── java/
│       │   └── com/
│       │       └── hostel/
│       │           ├── HostelManagementApplication.java  # Spring Boot Main Entry
│       │           ├── config/
│       │           │   └── AppConfig.java                # CORS & MVC Config
│       │           ├── controller/                       # REST API Endpoints
│       │           │   ├── AuthController.java
│       │           │   ├── OwnerController.java          # Full Owner CRUD
│       │           │   ├── TenantController.java         # Full Tenant CRUD
│       │           │   ├── RoomController.java
│       │           │   ├── ApplicationController.java
│       │           │   ├── RentController.java
│       │           │   └── ComplaintController.java
│       │           ├── service/                          # Business Logic
│       │           │   ├── AuthService.java
│       │           │   ├── OwnerService.java
│       │           │   ├── TenantService.java
│       │           │   ├── RoomService.java
│       │           │   ├── ApplicationService.java
│       │           │   ├── RentService.java
│       │           │   └── ComplaintService.java
│       │           ├── entity/                           # Core Domain Entities
│       │           │   ├── OwnerEntity.java
│       │           │   ├── RoomEntity.java
│       │           │   ├── TenantEntity.java
│       │           │   ├── TenantApplicationEntity.java
│       │           │   ├── RentPaymentEntity.java
│       │           │   └── ComplaintEntity.java
│       │           └── dto/                              # Data Transfer Objects
│       │               ├── OwnerDTO.java
│       │               ├── RoomDTO.java
│       │               ├── TenantDTO.java
│       │               ├── TenantApplicationDTO.java
│       │               ├── RentPaymentDTO.java
│       │               ├── ComplaintDTO.java
│       │               ├── AuthRequestDTO.java
│       │               └── AuthResponseDTO.java
│       └── resources/
│           ├── application.properties
│           └── static/                                   # Fullstack Web Dashboard
│               ├── index.html
│               ├── css/styles.css
│               └── js/app.js
```

---

## 🚀 How to Run the Application

### Option A: Running from IntelliJ IDEA Community Edition (Recommended for Class)
1. Open IntelliJ IDEA.
2. Click **File -> Open...** and select `C:\Users\Usaid Khan\Documents\IP-Java-Sem5`.
3. Allow IntelliJ to import the Maven project (it automatically indexes `pom.xml`).
4. Navigate to `src/main/java/com/hostel/HostelManagementApplication.java`.
5. Right-click and choose **Run 'HostelManagementApplication'** (or click the green Play icon).
6. Open your browser and go to:  
   👉 **http://localhost:8080/**

### Option B: Running from Command Prompt / PowerShell
Run the following commands in this directory:
```powershell
mvn spring-boot:run
```
*(Or use `.\mvnw spring-boot:run`)*

---

## 🧪 Testing with Postman (Step-by-Step)
Import [`postman/HostelManagement.postman_collection.json`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/postman/HostelManagement.postman_collection.json) into Postman:

### 1. Register a New Tenant Yourself
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/register/tenant`
- **Body** (JSON):
  ```json
  {
      "name": "Aarav Mehta",
      "email": "aarav@college.edu",
      "phone": "+91 98888 77777",
      "password": "password123",
      "collegeOrCompany": "Computer Science Sem 5"
  }
  ```

### 2. Register a New Owner Yourself
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/register/owner`
- **Body** (JSON):
  ```json
  {
      "name": "Suresh Verma",
      "email": "suresh@hostel.com",
      "phone": "+91 98111 55443",
      "password": "password123",
      "hostelName": "Greenfield Luxury PG",
      "address": "Knowledge Park II, Greater Noida"
  }
  ```

### 3. Log In with Your New Account
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Body** (JSON):
  ```json
  {
      "email": "aarav@college.edu",
      "password": "password123",
      "role": "TENANT"
  }
  ```

### 4. Create and Manage Rooms
- **Add Room**: `POST http://localhost:8080/api/rooms`
- **List All Rooms**: `GET http://localhost:8080/api/rooms`
- **List Available Rooms**: `GET http://localhost:8080/api/rooms/available`

### 5. Apply for a Room & Approve
- **Apply (Tenant)**: `POST http://localhost:8080/api/applications/apply`
  ```json
  {
      "tenantId": 3,
      "roomId": 101,
      "message": "Applying for single sharing room."
  }
  ```
- **Approve (Owner)**: `PUT http://localhost:8080/api/applications/103/approve`
  *(This automatically flips Room 101 to `OCCUPIED`!)*

### 6. Pay Rent & File Complaints
- **Pay Rent (Tenant)**: `POST http://localhost:8080/api/rent/pay`
- **File Complaint (Tenant)**: `POST http://localhost:8080/api/complaints`
- **Update Complaint Status (Owner)**: `PUT http://localhost:8080/api/complaints/503/status`
