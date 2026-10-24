package com.hostel.service;

import com.hostel.dto.RentPaymentDTO;
import com.hostel.entity.RentPaymentEntity;
import com.hostel.entity.TenantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class RentService {

    private final List<RentPaymentEntity> paymentList = new ArrayList<>();
    private int nextId = 1004;

    @Autowired
    private TenantService tenantService;

    public RentService() {
        // Pre-seeded rent payments
        paymentList.add(new RentPaymentEntity(1001, 1, "Rahul Sharma", 102, "B-201",
                7500.0, "August 2026", "02 Aug 2026", "UPI", "TXN-202608-9843", "PAID"));

        paymentList.add(new RentPaymentEntity(1002, 1, "Rahul Sharma", 102, "B-201",
                7500.0, "September 2026", "03 Sep 2026", "UPI", "TXN-202609-1123", "PAID"));

        paymentList.add(new RentPaymentEntity(1003, 1, "Rahul Sharma", 102, "B-201",
                7500.0, "October 2026", "05 Oct 2026", "Net Banking", "TXN-202610-4491", "PAID"));
    }

    public RentPaymentDTO payRent(RentPaymentDTO dto) {
        int tenantId = dto.getTenantId() != null ? dto.getTenantId() : 1;
        TenantEntity tenant = tenantService.getTenantEntityById(tenantId);
        String tenantName = tenant != null ? tenant.getName() : (dto.getTenantName() != null ? dto.getTenantName() : "Tenant");
        String roomNumber = tenant != null && tenant.getAssignedRoomNumber() != null ? tenant.getAssignedRoomNumber() : (dto.getRoomNumber() != null ? dto.getRoomNumber() : "N/A");
        int roomId = tenant != null && tenant.getAssignedRoomId() != null ? tenant.getAssignedRoomId() : (dto.getRoomId() != null ? dto.getRoomId() : 0);
        double amount = dto.getAmount() != null && dto.getAmount() > 0 ? dto.getAmount() : (tenant != null && tenant.getMonthlyRent() > 0 ? tenant.getMonthlyRent() : 7500.0);

        RentPaymentEntity entity = new RentPaymentEntity();
        entity.setId(nextId++);
        entity.setTenantId(tenantId);
        entity.setTenantName(tenantName);
        entity.setRoomId(roomId);
        entity.setRoomNumber(roomNumber);
        entity.setAmount(amount);
        entity.setMonth(dto.getMonth() != null && !dto.getMonth().isEmpty() ? dto.getMonth() : LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        entity.setPaymentDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        entity.setPaymentMethod(dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "UPI");
        entity.setTransactionId("TXN-" + System.currentTimeMillis() % 10000000);
        entity.setStatus("PAID");

        paymentList.add(0, entity);

        // Update tenant status to PAID
        if (tenant != null) {
            tenantService.updateRentStatus(tenant.getId(), "PAID");
        }

        return convertToDTO(entity);
    }

    public List<RentPaymentDTO> getAllPayments() {
        List<RentPaymentDTO> dtoList = new ArrayList<>();
        for (RentPaymentEntity entity : paymentList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<RentPaymentDTO> getPaymentsByTenant(int tenantId) {
        List<RentPaymentDTO> dtoList = new ArrayList<>();
        for (RentPaymentEntity entity : paymentList) {
            if (entity.getTenantId() == tenantId) {
                dtoList.add(convertToDTO(entity));
            }
        }
        return dtoList;
    }

    public Map<String, Object> getRentStats() {
        double totalCollected = 0.0;
        int paidCount = 0;
        for (RentPaymentEntity entity : paymentList) {
            if ("PAID".equalsIgnoreCase(entity.getStatus())) {
                totalCollected += entity.getAmount();
                paidCount++;
            }
        }

        double totalPending = 0.0;
        int pendingTenantsCount = 0;
        for (TenantEntity tenant : tenantService.getAllTenants().stream().map(tenantService::convertToEntity).toList()) {
            if ("DUE".equalsIgnoreCase(tenant.getRentStatus()) || "OVERDUE".equalsIgnoreCase(tenant.getRentStatus())) {
                totalPending += tenant.getMonthlyRent();
                pendingTenantsCount++;
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCollected", totalCollected);
        stats.put("totalPaymentsCount", paidCount);
        stats.put("totalPendingAmount", totalPending);
        stats.put("pendingTenantsCount", pendingTenantsCount);
        return stats;
    }

    public RentPaymentDTO convertToDTO(RentPaymentEntity entity) {
        RentPaymentDTO dto = new RentPaymentDTO();
        dto.setId(entity.getId());
        dto.setTenantId(entity.getTenantId());
        dto.setTenantName(entity.getTenantName());
        dto.setRoomId(entity.getRoomId());
        dto.setRoomNumber(entity.getRoomNumber());
        dto.setAmount(entity.getAmount());
        dto.setMonth(entity.getMonth());
        dto.setPaymentDate(entity.getPaymentDate());
        dto.setPaymentMethod(entity.getPaymentMethod());
        dto.setTransactionId(entity.getTransactionId());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
