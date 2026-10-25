# StayEase - Fullstack Hostel & PG Management System

> **IP Java Semester 5 Hands-on Project**  
> Built with **Java 17/21**, **Spring Boot**, **Spring Data JPA**, **Hibernate ORM**, **MySQL**, **React 18**, **Tailwind CSS**, and **Vite**.

---

##  Project Overview
StayEase is an enterprise-grade full-stack digital Hostel and PG Management System. It enables hostel owners to manage room inventory with real-time occupancy status, process tenant booking applications via a 1-click approval workflow, digitally track monthly rent payments with an integrated financial ledger, and manage tenant complaints from submission to resolution.

---

## ️ System Architecture

StayEase follows a decoupled, full-stack client-server architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                           │
│                                                                        │
│   [ REACT 18 SPA (Vite + Tailwind CSS) ]                               │
│   ├── Tab Isolation via sessionStorage                                 │
│   └── 0ms Real-Time Sync via BroadcastChannel API                      │
│                           │                                            │
│                           ▼ (HTTP / REST / JSON)                       │
│                                                                        │
│   [ SPRING BOOT REST BACKEND ]                                         │
│   ├── Controller Layer   (@RestController, Request Routing & DTOs)     │
│   ├── Service Layer      (Business Logic & @Transactional Workflows)   │
│   └── Repository Layer   (Spring Data JPA / JpaRepository)             │
│                           │                                            │
│                           ▼ (Hibernate ORM / JDBC)                     │
│                                                                        │
│   [ RELATIONAL DATABASE ]                                              │
│   ├── Primary: MySQL 8 / 9 (6 Relational Tables)                       │
│   └── Fallback: H2 In-Memory SQL Engine (/h2-console)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

##  Frontend Architecture

The frontend is built as a Single-Page Application (SPA) located in the [`frontend/`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/frontend) directory.

### Tech Stack
- **Library:** React 18
- **Build Tool:** Vite 5 (Fast Hot Module Replacement)
- **Styling:** Tailwind CSS (Responsive utility styling)
- **Icons:** Lucide React

### Component Hierarchy & Module Organization
```
frontend/src/
├── main.jsx                     # Application entry point with AuthProvider context
├── App.jsx                      # Root container, dynamic view routing, and toasts
├── index.css                    # Tailwind utility directives and custom scrollbars
├── context/
│   └── AuthContext.jsx          # Centralized auth state, tab isolation, and broadcast sync
├── services/
│   └── api.js                   # Unified REST API client (Fetch wrapper with Vite proxy)
└── components/
    ├── Navbar.jsx               # Header with brand identity, role badge, and session logout
    ├── AuthModal.jsx            # Tabbed Login / Registration for Owners & Tenants
    ├── OwnerDashboard.jsx       # Owner operations: Rooms, Applications, Rent ledger, Complaints
    ├── TenantDashboard.jsx      # Tenant portal: Room catalog, Active Lease, Payments, Grievances
    ├── RoomCard.jsx             # Visual room listing card with dynamic availability badges
    ├── AddRoomModal.jsx         # Dialog for owners to publish new rooms
    ├── ApplyRoomModal.jsx       # Dialog for tenants to submit booking requests
    ├── PayRentModal.jsx         # Interactive digital payment simulator (UPI, NetBanking, Card)
    ├── FileComplaintModal.jsx   # Grievance logging with category & priority selectors
    ├── UpdateComplaintModal.jsx # Owner complaint resolution & notes dialog
    └── Toast.jsx                # Floating status notifications (Success, Info, Error)
```

### Core Frontend Engineering Features
1. **Multi-Tab Session Isolation (`sessionStorage`)**:
   - Standard `localStorage` shares state across all browser tabs, causing role collisions.
   - Using `sessionStorage` allows an evaluator to open **Tab 1 as Owner** and **Tab 2 as Tenant** on the same computer with zero state conflict.
2. **Zero-Latency Cross-Tab Sync (`BroadcastChannel`)**:
   - Backed by the browser's native `BroadcastChannel('stayease_cross_tab_sync')`.
   - When an Owner approves a room booking in Tab 1, a broadcast triggers Tab 2 (Tenant) to automatically refresh and display the active lease without manual page reloads.
3. **Dual Execution Modes**:
   - **Development Mode**: Run Vite dev server (`npm run dev`) on port `5173` with instant hot-reloading and `/api` reverse proxy to port `8080`.
   - **Production Mode**: Running `npm run build` bundles the React SPA directly into `src/main/resources/static/`, allowing the Spring Boot executable JAR to serve both UI and API simultaneously from port `8080`.

---

##  Database & Persistence Architecture

StayEase employs **Spring Data JPA** with **Hibernate ORM** to manage data persistence across relational tables.

### Entity-Relationship (ER) Model

```
   ┌────────────────────────────────┐
   │             OWNERS             │
   ├────────────────────────────────┤
   │ PK  id                         │
   │     name, email, phone         │
   │     password, hostel_name      │
   │     address                    │
   └───────────────┬────────────────┘
                   │ 1:N
                   ▼
   ┌────────────────────────────────┐       1:N       ┌───────────────────────────────┐
   │             ROOMS              │◄────────────────┤      TENANT_APPLICATIONS      │
   ├────────────────────────────────┤                 ├───────────────────────────────┤
   │ PK  id                         │                 │ PK  id                        │
   │     room_number (UNIQUE)       │                 │ FK  tenant_id, tenant_name    │
   │     room_type, rent_amount     │                 │ FK  room_id, room_number      │
   │     security_deposit, status   │                 │     rent_amount, message      │
   │     amenities, description     │                 │     status, application_date  │
   │     image_url                  │                 └───────────────────────────────┘
   │ FK  owner_id                   │
   │ FK  current_tenant_id          │
   └───────────────▲────────────────┘
                   │
                   │ 1:1 (When occupied)
                   │
   ┌───────────────┴────────────────┐       1:N       ┌───────────────────────────────┐
   │            TENANTS             ├────────────────►│         RENT_PAYMENTS         │
   ├────────────────────────────────┤                 ├───────────────────────────────┤
   │ PK  id                         │                 │ PK  id                        │
   │     name, email (UNIQUE)       │                 │ FK  tenant_id, tenant_name    │
   │     phone, password            │                 │ FK  room_id, room_number      │
   │     college_or_company         │                 │     amount, month, method     │
   │ FK  assigned_room_id           │                 │     transaction_id, status    │
   │     assigned_room_number       │                 └───────────────────────────────┘
   │     monthly_rent, rent_status  │
   └───────────────┬────────────────┘
                   │ 1:N
                   ▼
   ┌────────────────────────────────┐
   │           COMPLAINTS           │
   ├────────────────────────────────┤
   │ PK  id                         │
   │ FK  tenant_id, tenant_name     │
   │     room_number, category      │
   │     title, description         │
   │     priority, status           │
   │     owner_notes, created_date  │
   │     resolved_date              │
   └────────────────────────────────┘
```

### Relational Tables Overview
| Table Name | Description | Key Attributes |
| :--- | :--- | :--- |
| **`owners`** | Stores landlord profiles & property branding | `id`, `email`, `name`, `hostel_name`, `address` |
| **`tenants`** | Student/resident records & active lease info | `id`, `email`, `assigned_room_id`, `monthly_rent`, `rent_status` |
| **`rooms`** | Hostel inventory with real-time occupancy | `id`, `room_number`, `room_type`, `rent_amount`, `status` (`AVAILABLE`, `OCCUPIED`, `UNDER_MAINTENANCE`) |
| **`tenant_applications`** | Booking requests submitted by tenants | `id`, `tenant_id`, `room_id`, `status` (`PENDING`, `APPROVED`, `REJECTED`) |
| **`rent_payments`** | Financial transaction records & receipts | `id`, `tenant_id`, `amount`, `payment_method`, `transaction_id`, `status` |
| **`complaints`** | Maintenance grievance ticketing | `id`, `tenant_id`, `room_number`, `category`, `priority`, `status`, `owner_notes` |

### Spring Data JPA Repositories
The data access layer uses Spring Data JPA's derived query generation to eliminate boilerplate SQL:
- [`OwnerRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/OwnerRepository.java): `findByEmail(String email)`
- [`TenantRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/TenantRepository.java): `findByEmail(String email)`
- [`RoomRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/RoomRepository.java): `findByStatus(String status)`, `findByRoomNumber(String roomNumber)`
- [`TenantApplicationRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/TenantApplicationRepository.java): `findByTenantId(int tenantId)`, `findByRoomId(int roomId)`
- [`RentPaymentRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/RentPaymentRepository.java): `findByTenantId(int tenantId)`
- [`ComplaintRepository`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/repository/ComplaintRepository.java): `findByTenantId(int tenantId)`

### Automated Seeding & SQL Scripts
- **Automatic Seeder ([DatabaseSeeder.java](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/java/com/hostel/config/DatabaseSeeder.java))**: Implements `CommandLineRunner`. On startup, if database tables are empty, it automatically populates initial demo owners, tenants, rooms, applications, payments, and complaints.
- **Raw SQL Script ([database.sql](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/database.sql))**: Standalone DDL/DML script with complete `CREATE TABLE` and `INSERT` statements ready for direct execution in MySQL Workbench or MySQL CLI.
- **Embedded H2 In-Memory Fallback**: Includes an H2 profile (`--spring.profiles.active=h2`) with interactive SQL console at `/h2-console` for offline demonstrations.

---

## 📁 Project Directory Structure

```
IP-Java-Sem5/
├── pom.xml                                      # Maven project configuration
├── database.sql                                 # Complete MySQL schema & seed script
├── BACKEND_LOGIC_AND_TESTING.md                 # Detailed backend workflows & JSON testing guide
├── FRONTEND_AND_DATABASE.md                     # Deep-dive frontend & database documentation
├── frontend/                                    # React 18 SPA (Vite + Tailwind)
│   ├── package.json
│   ├── vite.config.js                           # Proxy configuration (/api -> 8080)
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                             # React root entry
│       ├── App.jsx                              # Main app coordinator
│       ├── context/AuthContext.jsx              # Tab-isolated session & broadcast sync
│       ├── services/api.js                      # REST API client
│       └── components/                          # Modular UI components & modals
├── postman/
│   └── HostelManagement.postman_collection.json # Ready-to-import Postman test collection
└── src/
    └── main/
        ├── java/com/hostel/
        │   ├── HostelManagementApplication.java # Spring Boot main entry point
        │   ├── config/
        │   │   ├── AppConfig.java               # CORS & MVC static mappings
        │   │   └── DatabaseSeeder.java          # Automatic table population on startup
        │   ├── controller/                      # REST API controllers
        │   │   ├── AuthController.java
        │   │   ├── OwnerController.java
        │   │   ├── TenantController.java
        │   │   ├── RoomController.java
        │   │   ├── ApplicationController.java
        │   │   ├── RentController.java
        │   │   └── ComplaintController.java
        │   ├── service/                         # Business logic & transaction management
        │   ├── repository/                      # Spring Data JPA repositories
        │   ├── entity/                          # JPA mapped relational entities
        │   └── dto/                             # Data Transfer Objects
        └── resources/
            ├── application.properties           # Datasource & JPA configuration
            ├── application-h2.properties        # Embedded in-memory SQL profile
            └── static/                          # Compiled production frontend bundle
```

---