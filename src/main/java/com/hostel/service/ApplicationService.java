package com.hostel.service;

import com.hostel.dto.TenantApplicationDTO;
import com.hostel.entity.RoomEntity;
import com.hostel.entity.TenantApplicationEntity;
import com.hostel.entity.TenantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    private final List<TenantApplicationEntity> applicationList = new ArrayList<>();
    private int nextId = 103;

    @Autowired
    private RoomService roomService;

    @Autowired
    private TenantService tenantService;

    public ApplicationService() {
        // Sample pre-seeded application
        applicationList.add(new TenantApplicationEntity(101, 1, "Rahul Sharma", "tenant@college.edu",
                "+91 98111 22334", 102, "B-201", 7500.0,
                "Requesting accommodation for academic year 2026-27.", "APPROVED", "15 Oct 2026"));

        applicationList.add(new TenantApplicationEntity(102, 2, "Priya Patel", "priya@college.edu",
                "+91 98222 33445", 103, "C-302", 6500.0,
                "Need quiet room for semester exam preparation.", "APPROVED", "18 Oct 2026"));
    }

    public TenantApplicationDTO applyForRoom(TenantApplicationDTO dto) {
        if (dto.getRoomId() == null) {
            throw new IllegalArgumentException("Room ID is required.");
        }
        RoomEntity room = roomService.getRoomEntityById(dto.getRoomId());
        if (room == null) {
            throw new IllegalArgumentException("Selected room does not exist.");
        }
        if (!"AVAILABLE".equalsIgnoreCase(room.getStatus())) {
            throw new IllegalStateException("Room " + room.getRoomNumber() + " is currently " + room.getStatus() + " and cannot be booked.");
        }

        int tenantId = dto.getTenantId() != null ? dto.getTenantId() : 1;
        TenantEntity tenant = tenantService.getTenantEntityById(tenantId);
        String tenantName = tenant != null ? tenant.getName() : (dto.getTenantName() != null ? dto.getTenantName() : "Tenant");
        String tenantEmail = tenant != null ? tenant.getEmail() : (dto.getTenantEmail() != null ? dto.getTenantEmail() : "tenant@college.edu");
        String tenantPhone = tenant != null ? tenant.getPhone() : (dto.getTenantPhone() != null ? dto.getTenantPhone() : "N/A");

        TenantApplicationEntity entity = new TenantApplicationEntity();
        entity.setId(nextId++);
        entity.setTenantId(tenantId);
        entity.setTenantName(tenantName);
        entity.setTenantEmail(tenantEmail);
        entity.setTenantPhone(tenantPhone);
        entity.setRoomId(room.getId());
        entity.setRoomNumber(room.getRoomNumber());
        entity.setRentAmount(room.getRentAmount());
        entity.setMessage(dto.getMessage() != null && !dto.getMessage().isEmpty() ? dto.getMessage() : "Application submitted for room " + room.getRoomNumber());
        entity.setStatus("PENDING");
        entity.setApplicationDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));

        applicationList.add(0, entity);
        return convertToDTO(entity);
    }

    public List<TenantApplicationDTO> getAllApplications() {
        List<TenantApplicationDTO> dtoList = new ArrayList<>();
        for (TenantApplicationEntity entity : applicationList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<TenantApplicationDTO> getApplicationsByTenant(int tenantId) {
        List<TenantApplicationDTO> dtoList = new ArrayList<>();
        for (TenantApplicationEntity entity : applicationList) {
            if (entity.getTenantId() == tenantId) {
                dtoList.add(convertToDTO(entity));
            }
        }
        return dtoList;
    }

    public TenantApplicationDTO approveApplication(int applicationId) {
        for (TenantApplicationEntity entity : applicationList) {
            if (entity.getId() == applicationId) {
                entity.setStatus("APPROVED");

                // 1. Assign room and update its occupancy status to OCCUPIED (so room listing shows unavailable)
                roomService.assignRoomToTenant(entity.getRoomId(), entity.getTenantId(), entity.getTenantName());

                // 2. Update tenant's assigned room and rent
                tenantService.updateRoomAssignment(entity.getTenantId(), entity.getRoomId(), entity.getRoomNumber(), entity.getRentAmount());

                return convertToDTO(entity);
            }
        }
        return null;
    }

    public TenantApplicationDTO rejectApplication(int applicationId) {
        for (TenantApplicationEntity entity : applicationList) {
            if (entity.getId() == applicationId) {
                entity.setStatus("REJECTED");
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public TenantApplicationDTO convertToDTO(TenantApplicationEntity entity) {
        TenantApplicationDTO dto = new TenantApplicationDTO();
        dto.setId(entity.getId());
        dto.setTenantId(entity.getTenantId());
        dto.setTenantName(entity.getTenantName());
        dto.setTenantEmail(entity.getTenantEmail());
        dto.setTenantPhone(entity.getTenantPhone());
        dto.setRoomId(entity.getRoomId());
        dto.setRoomNumber(entity.getRoomNumber());
        dto.setRentAmount(entity.getRentAmount());
        dto.setMessage(entity.getMessage());
        dto.setStatus(entity.getStatus());
        dto.setApplicationDate(entity.getApplicationDate());
        return dto;
    }
}
