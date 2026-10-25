package com.hostel.config;

import com.hostel.entity.*;
import com.hostel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private OwnerRepository ownerRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantApplicationRepository applicationRepository;

    @Autowired
    private RentPaymentRepository paymentRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    @Override
    public void run(String... args) {
        if (ownerRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedDatabase() {
        // 1. Seed Owner
        OwnerEntity owner = new OwnerEntity();
        owner.setName("Vikram Malhotra");
        owner.setEmail("owner@hostel.com");
        owner.setPhone("+91 98765 43210");
        owner.setPassword("password123");
        owner.setHostelName("Shree Sai Royal PG & Hostels");
        owner.setAddress("Plot 42, Knowledge Park III, Greater Noida");
        OwnerEntity savedOwner = ownerRepository.save(owner);

        // 2. Seed Tenants
        TenantEntity tenant1 = new TenantEntity();
        tenant1.setName("Rahul Sharma");
        tenant1.setEmail("tenant@college.edu");
        tenant1.setPhone("+91 98111 22334");
        tenant1.setPassword("password123");
        tenant1.setCollegeOrCompany("Computer Science - Sem 5");
        tenant1.setAssignedRoomId(102);
        tenant1.setAssignedRoomNumber("B-201");
        tenant1.setMonthlyRent(7500.0);
        tenant1.setRentStatus("PAID");
        TenantEntity savedTenant1 = tenantRepository.save(tenant1);

        TenantEntity tenant2 = new TenantEntity();
        tenant2.setName("Priya Patel");
        tenant2.setEmail("priya@college.edu");
        tenant2.setPhone("+91 98222 33445");
        tenant2.setPassword("password123");
        tenant2.setCollegeOrCompany("Information Technology - Sem 5");
        tenant2.setAssignedRoomId(103);
        tenant2.setAssignedRoomNumber("C-302");
        tenant2.setMonthlyRent(6500.0);
        tenant2.setRentStatus("DUE");
        TenantEntity savedTenant2 = tenantRepository.save(tenant2);

        // 3. Seed Rooms
        RoomEntity r101 = new RoomEntity(0, "A-101", "Single Sharing", 9500.0, 10000.0,
                "AVAILABLE", "Attached Washroom, Air Conditioning, High-speed Wi-Fi, Study Desk, Balcony",
                "Spacious premium single-sharing room on the 1st floor with ample natural sunlight and garden view.",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), null, null);
        roomRepository.save(r101);

        RoomEntity r102 = new RoomEntity(0, "B-201", "Double Sharing", 7500.0, 8000.0,
                "OCCUPIED", "Air Conditioning, Wi-Fi, Balcony, Attached Washroom, Wardrobes",
                "Deluxe double sharing room currently leased to Rahul Sharma.",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), savedTenant1.getId(), savedTenant1.getName());
        RoomEntity savedR102 = roomRepository.save(r102);

        RoomEntity r103 = new RoomEntity(0, "C-302", "Double Sharing", 6500.0, 7000.0,
                "OCCUPIED", "Ceiling Fan, High-speed Wi-Fi, Attached Washroom, Personal Study Tables",
                "Standard double-sharing room currently leased to Priya Patel.",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), savedTenant2.getId(), savedTenant2.getName());
        RoomEntity savedR103 = roomRepository.save(r103);

        RoomEntity r104 = new RoomEntity(0, "A-104", "Single Sharing", 11500.0, 12000.0,
                "AVAILABLE", "Air Conditioning, Smart TV, Mini Fridge, Attached Luxury Bath, High-speed Wi-Fi",
                "Executive single suite with premium wooden furnishings and housekeeping.",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), null, null);
        roomRepository.save(r104);

        RoomEntity r105 = new RoomEntity(0, "B-205", "Triple Sharing", 5200.0, 6000.0,
                "AVAILABLE", "High-speed Wi-Fi, Balcony, Geyser, Triple Wardrobes, Power Backup",
                "Budget-friendly spacious triple-sharing room ideal for college students.",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), null, null);
        roomRepository.save(r105);

        RoomEntity r106 = new RoomEntity(0, "D-401", "Double Sharing", 6800.0, 7500.0,
                "UNDER_MAINTENANCE", "Air Conditioning, Wi-Fi, Attached Washroom",
                "Scheduled for fresh painting, tile polishing, and AC servicing.",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
                savedOwner.getId(), null, null);
        roomRepository.save(r106);

        // Update assigned room IDs for tenants to match generated database IDs
        savedTenant1.setAssignedRoomId(savedR102.getId());
        tenantRepository.save(savedTenant1);

        savedTenant2.setAssignedRoomId(savedR103.getId());
        tenantRepository.save(savedTenant2);

        // 4. Seed Applications
        TenantApplicationEntity app1 = new TenantApplicationEntity(0, savedTenant1.getId(), savedTenant1.getName(),
                savedTenant1.getEmail(), savedTenant1.getPhone(), savedR102.getId(), "B-201", 7500.0,
                "Requesting accommodation for academic year 2026-27.", "APPROVED", "15 Oct 2026");
        applicationRepository.save(app1);

        TenantApplicationEntity app2 = new TenantApplicationEntity(0, savedTenant2.getId(), savedTenant2.getName(),
                savedTenant2.getEmail(), savedTenant2.getPhone(), savedR103.getId(), "C-302", 6500.0,
                "Need quiet room for semester exam preparation.", "APPROVED", "18 Oct 2026");
        applicationRepository.save(app2);

        // 5. Seed Payments
        RentPaymentEntity p1 = new RentPaymentEntity(0, savedTenant1.getId(), savedTenant1.getName(),
                savedR102.getId(), "B-201", 7500.0, "August 2026", "02 Aug 2026", "UPI", "TXN-202608-9843", "PAID");
        paymentRepository.save(p1);

        RentPaymentEntity p2 = new RentPaymentEntity(0, savedTenant1.getId(), savedTenant1.getName(),
                savedR102.getId(), "B-201", 7500.0, "September 2026", "03 Sep 2026", "UPI", "TXN-202609-1123", "PAID");
        paymentRepository.save(p2);

        RentPaymentEntity p3 = new RentPaymentEntity(0, savedTenant1.getId(), savedTenant1.getName(),
                savedR102.getId(), "B-201", 7500.0, "October 2026", "05 Oct 2026", "Net Banking", "TXN-202610-4491", "PAID");
        paymentRepository.save(p3);

        // 6. Seed Complaints
        ComplaintEntity c1 = new ComplaintEntity(0, savedTenant2.getId(), savedTenant2.getName(), "C-302",
                "Wi-Fi", "Intermittent Wi-Fi Disconnection",
                "High latency and packet drops in Room C-302 during evening hours, affecting project submission.",
                "MEDIUM", "OPEN", "Pending technician visit scheduled for Monday.",
                "23 Oct 2026", null);
        complaintRepository.save(c1);

        ComplaintEntity c2 = new ComplaintEntity(0, savedTenant1.getId(), savedTenant1.getName(), "B-201",
                "Plumbing", "Bathroom Washbasin Valve Leaking",
                "Water dripping slowly from the main basin valve.",
                "HIGH", "RESOLVED", "Plumber replaced the internal washer and tested pressure.",
                "20 Oct 2026", "21 Oct 2026");
        complaintRepository.save(c2);
    }
}
