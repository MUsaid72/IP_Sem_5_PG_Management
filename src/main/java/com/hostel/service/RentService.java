package com.hostel.service;

import com.hostel.dto.RentPaymentDTO;
import com.hostel.dto.TenantDTO;
import com.hostel.entity.RentPaymentEntity;
import com.hostel.entity.TenantEntity;
import com.hostel.repository.RentPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class RentService {

    @Autowired
    private RentPaymentRepository paymentRepository;

    @Autowired
    private TenantService tenantService;

    @Transactional
    public RentPaymentDTO payRent(RentPaymentDTO dto) {
        int tenantId = dto.getTenantId() != null ? dto.getTenantId() : 1;
        TenantEntity tenant = tenantService.getTenantEntityById(tenantId);
        String tenantName = tenant != null ? tenant.getName() : (dto.getTenantName() != null ? dto.getTenantName() : "Tenant");
        String roomNumber = tenant != null && tenant.getAssignedRoomNumber() != null ? tenant.getAssignedRoomNumber() : (dto.getRoomNumber() != null ? dto.getRoomNumber() : "N/A");
        int roomId = tenant != null && tenant.getAssignedRoomId() != null ? tenant.getAssignedRoomId() : (dto.getRoomId() != null ? dto.getRoomId() : 0);
        double amount = dto.getAmount() != null && dto.getAmount() > 0 ? dto.getAmount() : (tenant != null && tenant.getMonthlyRent() > 0 ? tenant.getMonthlyRent() : 7500.0);

        RentPaymentEntity entity = new RentPaymentEntity();
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

        RentPaymentEntity saved = paymentRepository.save(entity);

        // Update tenant status to PAID
        if (tenant != null) {
            tenantService.updateRentStatus(tenant.getId(), "PAID");
        }

        return convertToDTO(saved);
    }

    public List<RentPaymentDTO> getAllPayments() {
        List<RentPaymentDTO> dtoList = new ArrayList<>();
        for (RentPaymentEntity entity : paymentRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<RentPaymentDTO> getPaymentsByTenant(int tenantId) {
        List<RentPaymentDTO> dtoList = new ArrayList<>();
        for (RentPaymentEntity entity : paymentRepository.findByTenantId(tenantId)) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public Map<String, Object> getRentStats() {
        double totalCollected = 0.0;
        int paidCount = 0;
        for (RentPaymentEntity entity : paymentRepository.findAll()) {
            if ("PAID".equalsIgnoreCase(entity.getStatus())) {
                totalCollected += entity.getAmount();
                paidCount++;
            }
        }

        double totalPending = 0.0;
        int pendingTenantsCount = 0;
        for (TenantDTO tenant : tenantService.getAllTenants()) {
            if ("DUE".equalsIgnoreCase(tenant.getRentStatus()) || "OVERDUE".equalsIgnoreCase(tenant.getRentStatus())) {
                totalPending += (tenant.getMonthlyRent() != null ? tenant.getMonthlyRent() : 0.0);
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
        if (entity == null) return null;
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
