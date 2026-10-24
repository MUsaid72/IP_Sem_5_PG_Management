package com.hostel.service;

import com.hostel.dto.ComplaintDTO;
import com.hostel.entity.ComplaintEntity;
import com.hostel.entity.TenantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ComplaintService {

    private final List<ComplaintEntity> complaintList = new ArrayList<>();
    private int nextId = 503;

    @Autowired
    private TenantService tenantService;

    public ComplaintService() {
        // Pre-seeded complaints for immediate showcase
        complaintList.add(new ComplaintEntity(501, 2, "Priya Patel", "C-302",
                "Wi-Fi", "Intermittent Wi-Fi Disconnection",
                "High latency and packet drops in Room C-302 during evening hours, affecting project submission.",
                "MEDIUM", "OPEN", "Pending technician visit scheduled for Monday.",
                "23 Oct 2026", null));

        complaintList.add(new ComplaintEntity(502, 1, "Rahul Sharma", "B-201",
                "Plumbing", "Bathroom Washbasin Valve Leaking",
                "Water dripping slowly from the main basin valve.",
                "HIGH", "RESOLVED", "Plumber replaced the internal washer and tested pressure.",
                "20 Oct 2026", "21 Oct 2026"));
    }

    public ComplaintDTO fileComplaint(ComplaintDTO dto) {
        int tenantId = dto.getTenantId() != null ? dto.getTenantId() : 1;
        TenantEntity tenant = tenantService.getTenantEntityById(tenantId);
        String tenantName = tenant != null ? tenant.getName() : (dto.getTenantName() != null ? dto.getTenantName() : "Tenant");
        String roomNumber = tenant != null && tenant.getAssignedRoomNumber() != null ? tenant.getAssignedRoomNumber() : (dto.getRoomNumber() != null ? dto.getRoomNumber() : "N/A");

        ComplaintEntity entity = new ComplaintEntity();
        entity.setId(nextId++);
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

        complaintList.add(0, entity);
        return convertToDTO(entity);
    }

    public List<ComplaintDTO> getAllComplaints() {
        List<ComplaintDTO> dtoList = new ArrayList<>();
        for (ComplaintEntity entity : complaintList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public List<ComplaintDTO> getComplaintsByTenant(int tenantId) {
        List<ComplaintDTO> dtoList = new ArrayList<>();
        for (ComplaintEntity entity : complaintList) {
            if (entity.getTenantId() == tenantId) {
                dtoList.add(convertToDTO(entity));
            }
        }
        return dtoList;
    }

    public ComplaintDTO getComplaintById(int id) {
        for (ComplaintEntity entity : complaintList) {
            if (entity.getId() == id) {
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public ComplaintDTO updateComplaintStatus(int id, String status, String ownerNotes) {
        for (ComplaintEntity entity : complaintList) {
            if (entity.getId() == id) {
                entity.setStatus(status);
                if (ownerNotes != null && !ownerNotes.isEmpty()) {
                    entity.setOwnerNotes(ownerNotes);
                }
                if ("RESOLVED".equalsIgnoreCase(status)) {
                    entity.setResolvedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
                }
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public ComplaintDTO convertToDTO(ComplaintEntity entity) {
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
