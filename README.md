# StayEase - Fullstack Hostel & PG Management System

> **IP Java Semester 5 Hands-on Project**  
> Built with **Java 21/26**, **Spring Boot 4 / 3**, **Apache Maven**, **REST API architecture**, and a **Modern Responsive Web UI**.

---

**Project Overview**
StayEase is a complete fullstack digital Hostel and PG Management System. It allows hostel owners to list and manage rooms, track tenant applications and occupancy, manage monthly rental collections digitally, and resolve tenant complaints in real time.

# Core Features
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

# Architecture & Code Structure
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
