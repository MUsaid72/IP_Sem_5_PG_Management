# 💻 Frontend Architecture & Database Connection Guide
**Project:** StayEase - Hostel & PG Management System  
**Frontend Stack:** React 18, Vite, Tailwind CSS, Lucide Icons  
**Database Stack:** MySQL 8/9, Spring Data JPA, Hibernate ORM, H2 In-Memory Fallback  

---

## 📑 Table of Contents
1. [Frontend Architecture Overview](#1-frontend-architecture-overview)
2. [Component Hierarchy & Responsibilities](#2-component-hierarchy--responsibilities)
3. [Session Isolation & Real-Time Cross-Tab Sync](#3-session-isolation--real-time-cross-tab-sync)
4. [API Client Layer & Vite Reverse Proxy](#4-api-client-layer--vite-reverse-proxy)
5. [Database Architecture & Schema Design](#5-database-architecture--schema-design)
   - [Entity-Relationship (ER) Model](#entity-relationship-er-model)
   - [Table Specifications](#table-specifications)
6. [Spring Data JPA & Hibernate Configuration](#6-spring-data-jpa--hibernate-configuration)
7. [MySQL Workbench Setup & Execution](#7-mysql-workbench-setup--execution)
8. [Dual Execution Modes (Vite Dev vs Spring Boot Bundle)](#8-dual-execution-modes)

---

## 1. Frontend Architecture Overview

The frontend is built as a single-page application (SPA) inside the `frontend/` directory, designed for real-time responsiveness, modularity, and clean role separation.

```
frontend/
├── index.html                      # HTML5 entry point with Inter font
├── vite.config.js                  # Dev server proxy (/api -> 8080) & build output config
├── tailwind.config.js              # Custom utility styles, color palettes, animations
├── postcss.config.js
└── src/
    ├── main.jsx                    # React 18 root mounting with AuthProvider
    ├── App.jsx                     # Top-level coordinator: Modals, Toasts & View Routing
    ├── index.css                   # Tailwind directives and custom scrollbars
    ├── context/
    │   └── AuthContext.jsx         # Global Auth state, tab isolation & BroadcastChannel
    ├── services/
    │   └── api.js                  # Modular Fetch client for all 20+ backend endpoints
    └── components/
        ├── Navbar.jsx              # Brand header, active user badge, logout trigger
        ├── AuthModal.jsx           # Tabbed login/registration for Owner & Tenant
        ├── OwnerDashboard.jsx      # Owner control center (Rooms, Applications, Rent, Complaints)
        ├── TenantDashboard.jsx     # Tenant portal (Catalog, My Room, Payments, Grievances)
        ├── RoomCard.jsx            # Reusable card with dynamic badges & action buttons
        ├── AddRoomModal.jsx        # Dialog for owners to publish new rooms
        ├── ApplyRoomModal.jsx      # Dialog for tenants to submit booking requests
        ├── PayRentModal.jsx        # Interactive digital payment simulator (UPI/Cards)
        ├── FileComplaintModal.jsx  # Grievance submission dialog with priority selector
        ├── UpdateComplaintModal.jsx# Resolution dialog with owner notes
        └── Toast.jsx               # Floating success, warning, and error alerts
```

---

## 2. Component Hierarchy & Responsibilities

```
                      ┌──────────────────────┐
                      │     main.jsx         │
                      └──────────┬───────────┘
                                 │
                      ┌──────────▼───────────┐
                      │    AuthProvider      │ (AuthContext)
                      └──────────┬───────────┘
                                 │
                      ┌──────────▼───────────┐
                      │       App.jsx        │
                      └──────────┬───────────┘
          ┌──────────────────────┼──────────────────────┐
          ▼                      ▼                      ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│    Navbar.jsx     │  │   AuthModal.jsx   │  │     Toast.jsx     │
└───────────────────┘  └───────────────────┘  └───────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
          ┌───────────────────┐     ┌───────────────────┐
          │ OwnerDashboard    │     │  TenantDashboard  │
          └─────────┬─────────┘     └─────────┬─────────┘
                    │                         │
     ┌──────────────┼──────────────┐          ├─────────────────────┐
     ▼              ▼              ▼          ▼                     ▼
┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐         ┌───────────┐
│ RoomCard │  │ AddRoom  │  │ Update   │ │ RoomCard │         │ ApplyRoom │
│          │  │  Modal   │  │Complaint │ │          │         │   Modal   │
└──────────┘  └──────────┘  └──────────┘ └──────────┘         └───────────┘
                                              │                     │
                                         ┌────┴─────┐         ┌─────┴─────┐
                                         ▼          ▼         ▼           ▼
                                     ┌───────┐ ┌─────────┐ ┌─────┐ ┌─────────┐
                                     │PayRent│ │Complaint│ │ ... │ │   ...   │
                                     │ Modal │ │  Modal  │ └─────┘ └─────────┘
                                     └───────┘ └─────────┘
```

---

## 3. Session Isolation & Real-Time Cross-Tab Sync

### Problem: Multi-Tab State Conflict
When evaluating the application with two browser tabs open simultaneously (e.g. **Tab 1 = Owner** and **Tab 2 = Tenant**), standard applications sharing `localStorage` overwrite the active user session. Refreshing Tab 1 causes the Owner to switch into Tenant mode.

### Solution: `sessionStorage` + `BroadcastChannel`
1. **Per-Tab Isolation (`sessionStorage`):**
   - Each browser tab maintains its own independent storage scope.
   - You can log in as **Owner** in Tab 1 and as **Tenant** in Tab 2 without any session leakage.

2. **0ms Cross-Tab Real-Time Sync (`BroadcastChannel`):**
   - Implemented via `new BroadcastChannel('stayease_cross_tab_sync')` inside [`AuthContext.jsx`](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/frontend/src/context/AuthContext.jsx).
   - When an Owner approves a room booking in Tab 1, it broadcasts an event.
   - Tab 2 (Tenant) instantly receives the broadcast and **refetches without a manual page reload**:
     - Room `A-101` immediately disappears from the available room list.
     - The tenant's application status updates to `APPROVED`.
     - Monthly rent shows as `DUE`.

---

## 4. API Client Layer & Vite Reverse Proxy

### API Client (`src/services/api.js`)
All communication with Spring Boot uses a centralized REST client module:
- Automatic JSON serialization/deserialization.
- Standardized error unwrapping.
- Endpoints grouped by domain (`authApi`, `ownersApi`, `tenantsApi`, `roomsApi`, `applicationsApi`, `rentApi`, `complaintsApi`).

### Development Reverse Proxy (`vite.config.js`)
During development (`npm run dev` on port `5173`), requests to `/api/*` are transparently routed to Spring Boot on port `8080`, completely preventing CORS issues:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: false
  }
});
```

---

## 5. Database Architecture & Schema Design

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

---

### Table Specifications

#### 1. `owners`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique owner ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Owner full name |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Owner login email |
| `phone` | `VARCHAR(20)` | `NULL` | Contact phone number |
| `password`| `VARCHAR(255)` | `NOT NULL` | Account password |
| `hostel_name`| `VARCHAR(255)` | `NULL` | Hostel / PG commercial brand |
| `address`| `VARCHAR(500)` | `NULL` | Property street address |

#### 2. `tenants`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique tenant ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Tenant full name |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Tenant login email |
| `phone` | `VARCHAR(20)` | `NULL` | Contact phone number |
| `password`| `VARCHAR(255)` | `NOT NULL` | Account password |
| `college_or_company` | `VARCHAR(255)` | `NULL` | Institution or employer |
| `assigned_room_id` | `INT` | `NULL` | ID of rented room |
| `assigned_room_number` | `VARCHAR(50)` | `NULL` | Room label (e.g. `B-201`) |
| `monthly_rent` | `DOUBLE` | `DEFAULT 0.0` | Agreed monthly rate (INR) |
| `rentStatus` | `VARCHAR(20)` | `DEFAULT 'DUE'` | `PAID`, `DUE`, `OVERDUE` |

#### 3. `rooms`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Unique room ID |
| `room_number` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Room code (e.g. `A-101`) |
| `room_type` | `VARCHAR(100)` | `NOT NULL` | Single / Double / Triple Sharing |
| `rent_amount` | `DOUBLE` | `NOT NULL` | Monthly rent price (INR) |
| `security_deposit` | `DOUBLE` | `NOT NULL` | Refundable security deposit |
| `status` | `VARCHAR(50)` | `DEFAULT 'AVAILABLE'` | `AVAILABLE`, `OCCUPIED`, `UNDER_MAINTENANCE` |
| `amenities` | `VARCHAR(1000)`| `NULL` | Comma-delimited amenities list |
| `description` | `VARCHAR(2000)`| `NULL` | Detailed description |
| `image_url` | `VARCHAR(1000)`| `NULL` | Photo URL |
| `owner_id` | `INT` | `NOT NULL, DEFAULT 1` | Managing owner reference |
| `current_tenant_id` | `INT` | `NULL` | Active occupant ID |
| `current_tenant_name` | `VARCHAR(255)` | `NULL` | Active occupant name |

#### 4. `tenant_applications`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Application tracking ID |
| `tenant_id` | `INT` | `NOT NULL` | Applicant ID |
| `tenant_name` | `VARCHAR(255)` | `NULL` | Applicant name |
| `tenant_email` | `VARCHAR(255)` | `NULL` | Applicant email |
| `tenant_phone` | `VARCHAR(50)` | `NULL` | Applicant phone |
| `room_id` | `INT` | `NOT NULL` | Target room ID |
| `room_number` | `VARCHAR(50)` | `NULL` | Target room number |
| `rent_amount` | `DOUBLE` | `NOT NULL` | Agreed rent rate |
| `message` | `VARCHAR(1000)` | `NULL` | Application note from tenant |
| `status` | `VARCHAR(30)` | `DEFAULT 'PENDING'` | `PENDING`, `APPROVED`, `REJECTED` |
| `application_date` | `VARCHAR(50)` | `NULL` | Formatted submission date |

#### 5. `rent_payments`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Payment record ID |
| `tenant_id` | `INT` | `NOT NULL` | Tenant ID |
| `tenant_name` | `VARCHAR(255)` | `NULL` | Tenant name |
| `room_id` | `INT` | `NOT NULL` | Room ID |
| `room_number` | `VARCHAR(50)` | `NULL` | Room number |
| `amount` | `DOUBLE` | `NOT NULL` | Amount paid (INR) |
| `month` | `VARCHAR(50)` | `NULL` | Billing cycle (e.g. `October 2026`) |
| `payment_date` | `VARCHAR(50)` | `NULL` | Execution timestamp |
| `payment_method` | `VARCHAR(50)` | `NULL` | `UPI`, `Net Banking`, `Card`, `Cash` |
| `transaction_id` | `VARCHAR(100)` | `NULL` | Reference ID (`TXN-XXXX`) |
| `status` | `VARCHAR(30)` | `DEFAULT 'PAID'` | `PAID`, `PENDING`, `FAILED` |

#### 6. `complaints`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `AUTO_INCREMENT, PRIMARY KEY` | Complaint ticket ID |
| `tenant_id` | `INT` | `NOT NULL` | Complaining tenant ID |
| `tenant_name` | `VARCHAR(255)` | `NULL` | Tenant name |
| `room_number` | `VARCHAR(50)` | `NULL` | Room number |
| `category` | `VARCHAR(100)` | `NULL` | `Plumbing`, `Electrical`, `Wi-Fi`, `Food`, etc. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Short issue summary |
| `description` | `VARCHAR(2000)` | `NULL` | Complete grievance details |
| `priority` | `VARCHAR(30)` | `DEFAULT 'MEDIUM'` | `LOW`, `MEDIUM`, `HIGH`, `URGENT` |
| `status` | `VARCHAR(30)` | `DEFAULT 'OPEN'` | `OPEN`, `IN_PROGRESS`, `RESOLVED` |
| `owner_notes` | `VARCHAR(2000)` | `NULL` | Resolution notes by owner |
| `created_date` | `VARCHAR(50)` | `NULL` | Timestamp of logging |
| `resolved_date` | `VARCHAR(50)` | `NULL` | Timestamp of resolution |

---

## 6. Spring Data JPA & Hibernate Configuration

The persistence layer is configured in [src/main/resources/application.properties](file:///c:/Users/Usaid%20Khan/Documents/IP-Java-Sem5/src/main/resources/application.properties):

```properties
# MySQL JDBC Datasource
spring.datasource.url=jdbc:mysql://localhost:3306/hostel_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate DDL & SQL Display
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# Transaction view preservation
spring.jpa.open-in-view=true
```

- **`createDatabaseIfNotExist=true`**: Automatically creates the `hostel_management` schema if missing.
- **`ddl-auto=update`**: Safely alters table schemas to match Entity class definitions without dropping existing data.
- **`DatabaseSeeder.java`**: Implements `CommandLineRunner`. Runs on application startup; if tables are empty, it automatically populates all default records.

---

## 7. MySQL Workbench Setup & Execution

### Option A: Using MySQL Workbench GUI
1. Open **MySQL Workbench**.
2. Double-click your local connection (**Local instance MySQL** on port `3306`).
3. Press `Ctrl + Shift + O` (or **File** ➔ **Open SQL Script...**).
4. Select `database.sql` located at:
   ```text
   C:\Users\Usaid Khan\Documents\IP-Java-Sem5\database.sql
   ```
5. Click the **⚡ Execute** button (or press `Ctrl + Shift + Enter`).
6. In the left panel, click **Schemas** ➔ right-click ➔ **Refresh All**. You will see all 6 tables populated with data.

### Option B: Using MySQL Command Line Client
1. Open **MySQL Command Line Client** from the Windows Start menu.
2. Enter your MySQL password.
3. Execute the script:
   ```sql
   source C:/Users/Usaid Khan/Documents/IP-Java-Sem5/database.sql;
   ```

---

## 8. Dual Execution Modes

### Mode 1: React Dev Server (Vite Hot-Reload)
Best for active frontend modification with instant live preview:
```powershell
# Terminal 1: Start Spring Boot backend
cd "c:\Users\Usaid Khan\Documents\IP-Java-Sem5"
mvn spring-boot:run

# Terminal 2: Start Vite Dev Server
cd "c:\Users\Usaid Khan\Documents\IP-Java-Sem5\frontend"
npm run dev
```
Open **http://localhost:5173**. Changes in JSX/Tailwind files update in milliseconds without refreshing.

### Mode 2: Integrated Single-Jar Production Mode
Best for classroom demonstrations, grading, and production deployment:
```powershell
# 1. Build React into Spring Boot's static folder
cd "c:\Users\Usaid Khan\Documents\IP-Java-Sem5\frontend"
npm run build

# 2. Launch Spring Boot
cd "c:\Users\Usaid Khan\Documents\IP-Java-Sem5"
mvn spring-boot:run
```
Open **http://localhost:8080**. The backend serves both the compiled React SPA and all REST APIs simultaneously from a single server.

### Offline / Demo Fallback (H2 In-Memory)
If MySQL Server is not running on port 3306:
```powershell
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
The system will run in-memory SQL with full functionality and an interactive SQL console at **http://localhost:8080/h2-console**.
