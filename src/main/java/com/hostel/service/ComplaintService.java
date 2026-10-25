package com.hostel.service;

import com.hostel.dto.ComplaintDTO;
import com.hostel.entity.ComplaintEntity;
import com.hostel.entity.TenantEntity;
import com.hostel.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private TenantService tenantService;

    @Transactional
    public ComplaintDTO fileComplaint(ComplaintDTO dto) {
        int tenantId = dto.getTenantId() != null ? dto.getTenantId() : 1;
        TenantEntity tenant = tenantService.getTenantEntityById(tenantId);
        String tenantName = tenant != null ? tenant.getName() : (dto.getTenantName() != null ? dto.getTenantName() : "Tenant");
        String roomNumber = tenant != null && tenant.getAssignedRoomNumber() != null ? tenant.getAssignedRoomNumber() : (dto.getRoomNumber() != null ? dto.getRoomNumber() : "N/A");

        ComplaintEntity entity = new ComplaintEntity();
        entity.setTenantId(tenantId);
        entity.setTenantName(tenantName);
        entity.setRoomNumber(roomNumber);
        entity.setCategory(dto.getCategory() != null ? dto.getCategory() : "General");
        entity.setTitle(dto.getTitle() != null ? dto.getTitle() : "Maintenance Request");
        entity.setDescription(dto.getDescription() != null ? dto.getDescription() : "Issue reported by tenant.");
        entity.setPriority(dto.getPriority() != null ? dto.getPriority() : "MEDIUM");
        entity.setStatus("OPEN");
        entity.setOwnerNotes("");
        entity.setCreatedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
        entity.setResolvedDate(null);

        ComplaintEntity saved = complaintRepository.save(entity);
        return convertToDTO(saved);
    }

    public List<ComplaintDTO> getAllComplaints() {
        List<ComplaintDTO> dtoList = new ArrayList<>();
        for (ComplaintEntity entity : complaintRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<ComplaintDTO> getComplaintsByTenant(int tenantId) {
        List<ComplaintDTO> dtoList = new ArrayList<>();
        for (ComplaintEntity entity : complaintRepository.findByTenantId(tenantId)) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public ComplaintDTO getComplaintById(int id) {
        return complaintRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    @Transactional
    public ComplaintDTO updateComplaintStatus(int id, String status, String ownerNotes) {
        Optional<ComplaintEntity> opt = complaintRepository.findById(id);
        if (opt.isPresent()) {
            ComplaintEntity entity = opt.get();
            entity.setStatus(status);
            if (ownerNotes != null && !ownerNotes.isEmpty()) {
                entity.setOwnerNotes(ownerNotes);
            }
            if ("RESOLVED".equalsIgnoreCase(status)) {
                entity.setResolvedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            }
            ComplaintEntity saved = complaintRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    public ComplaintDTO convertToDTO(ComplaintEntity entity) {
        if (entity == null) return null;
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(entity.getId());
        dto.setTenantId(entity.getTenantId());
        dto.setTenantName(entity.getTenantName());
        dto.setRoomNumber(entity.getRoomNumber());
        dto.setCategory(entity.getCategory());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPriority(entity.getPriority());
        dto.setStatus(entity.getStatus());
        dto.setOwnerNotes(entity.getOwnerNotes());
        dto.setCreatedDate(entity.getCreatedDate());
        dto.setResolvedDate(entity.getResolvedDate());
        return dto;
    }
}
