package com.hostel.service;

import com.hostel.dto.TenantApplicationDTO;
import com.hostel.entity.RoomEntity;
import com.hostel.entity.TenantApplicationEntity;
import com.hostel.entity.TenantEntity;
import com.hostel.repository.TenantApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private TenantApplicationRepository applicationRepository;

    @Autowired
    private RoomService roomService;

    @Autowired
    private TenantService tenantService;

    @Transactional
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

        TenantApplicationEntity saved = applicationRepository.save(entity);
        return convertToDTO(saved);
    }

    public List<TenantApplicationDTO> getAllApplications() {
        List<TenantApplicationDTO> dtoList = new ArrayList<>();
        for (TenantApplicationEntity entity : applicationRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<TenantApplicationDTO> getApplicationsByTenant(int tenantId) {
        List<TenantApplicationDTO> dtoList = new ArrayList<>();
        for (TenantApplicationEntity entity : applicationRepository.findByTenantId(tenantId)) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    @Transactional
    public TenantApplicationDTO approveApplication(int applicationId) {
        Optional<TenantApplicationEntity> opt = applicationRepository.findById(applicationId);
        if (opt.isPresent()) {
            TenantApplicationEntity entity = opt.get();
            entity.setStatus("APPROVED");

            // 1. Assign room and update its occupancy status to OCCUPIED
            roomService.assignRoomToTenant(entity.getRoomId(), entity.getTenantId(), entity.getTenantName());

            // 2. Update tenant's assigned room and rent
            tenantService.updateRoomAssignment(entity.getTenantId(), entity.getRoomId(), entity.getRoomNumber(), entity.getRentAmount());

            TenantApplicationEntity saved = applicationRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    @Transactional
    public TenantApplicationDTO rejectApplication(int applicationId) {
        Optional<TenantApplicationEntity> opt = applicationRepository.findById(applicationId);
        if (opt.isPresent()) {
            TenantApplicationEntity entity = opt.get();
            entity.setStatus("REJECTED");
            TenantApplicationEntity saved = applicationRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    public TenantApplicationDTO convertToDTO(TenantApplicationEntity entity) {
        if (entity == null) return null;
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
