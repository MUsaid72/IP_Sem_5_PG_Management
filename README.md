# StayEase - Hostel / PG Management System

A fullstack Spring Boot application for managing Hostels and PGs. Built following the clean architecture pattern of the reference project (`BoltDelivery`):
- **Layered Architecture**: `Entity` ➔ `DTO` ➔ `Service` ➔ `Controller`
- **In-Memory Storage**: Using `ArrayList` in services with full CRUD and manual DTO ↔ Entity mapping
- **REST APIs**: Full CRUD operations for all entities, supporting both `/api/...` and `/...` paths with `@CrossOrigin`
- **Embedded Web Frontend**: Responsive, modern web interface served directly from `src/main/resources/static`
- **Postman Ready**: Pre-built collection included (`HostelManagement.postman_collection.json`)

---

## 🛠️ Tech Stack & Prerequisites
- **IDE**: IntelliJ IDEA (Community Edition)
- **Java**: JDK 17 / 21 / 25 / 26
- **Build Tool**: Apache Maven (`pom.xml` + Maven wrapper included)
- **Framework**: Spring Boot 4.1.0 (`spring-boot-starter-webmvc`, ModelMapper 3.2.0)
- **Frontend**: HTML5, CSS3 (Modern Flex/Grid, Card UI), Vanilla JavaScript (`fetch` API), Font Awesome 6
- **Testing**: Postman

---

## 🏛️ Entities & Core Features

| Entity | Fields | Core Purpose |
|---|---|---|
| **Owner** | `id`, `name`, `email`, `phone`, `address` | Hostel/PG property owners |
| **Room** | `id`, `ownerId`, `roomNumber`, `type`, `rentAmount`, `status` | Listing rooms with occupancy tracking (`Available`, `Occupied`, `Maintenance`) |
| **Tenant** | `id`, `name`, `email`, `phone`, `roomId`, `status`, `applicationDate` | Tenant application & approval workflow (`Applied`, `Approved`, `Rejected`) |
| **RentPayment** | `id`, `tenantId`, `amount`, `month`, `paymentDate`, `status` | Digital rent tracking (`Paid`, `Pending`, `Overdue`) |
| **Complaint** | `id`, `tenantId`, `title`, `description`, `status`, `createdDate` | Digital complaint ticketing (`Open`, `InProgress`, `Resolved`) |

---

## 🚀 Running the Application

### Option A: Using IntelliJ IDEA
1. Open IntelliJ IDEA.
2. Click **Open** and select the folder: `C:\Users\Usaid Khan\Documents\IP-Java-Sem5`.
3. Wait for Maven to sync dependencies.
4. Locate `src/main/java/HostelManagement/HostelManagementApplication.java`.
5. Click the green **Run** button (or press `Shift + F10`).

### Option B: Using Command Line (Maven)
```powershell
cd "c:\Users\Usaid Khan\Documents\IP-Java-Sem5"
mvn clean spring-boot:run
```
*(or using the wrapper: `.\mvnw.cmd spring-boot:run`)*

---

## 🌐 Accessing the Frontend
Once the application starts, open your browser (Chrome / Edge):
- **Dashboard / Home**: [http://localhost:8080/](http://localhost:8080/)
- **Owners**: [http://localhost:8080/owners.html](http://localhost:8080/owners.html)
- **Rooms**: [http://localhost:8080/rooms.html](http://localhost:8080/rooms.html)
- **Tenants**: [http://localhost:8080/tenants.html](http://localhost:8080/tenants.html)
- **Rent Payments**: [http://localhost:8080/rentpayments.html](http://localhost:8080/rentpayments.html)
- **Complaints**: [http://localhost:8080/complaints.html](http://localhost:8080/complaints.html)

---

## 📮 Testing with Postman
1. Open **Postman**.
2. Click **Import** (top left).
3. Drag & drop or select: `HostelManagement.postman_collection.json`.
4. You will see requests pre-configured for all 5 entities with sample JSON request bodies for:
   - `POST` (Create)
   - `GET` (List all)
   - `GET /{id}` (Find by ID)
   - `PUT /{id}` (Update)
   - `DELETE /{id}` (Remove)
