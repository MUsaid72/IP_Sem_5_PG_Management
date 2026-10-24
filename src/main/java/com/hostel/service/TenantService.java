package com.hostel.service;

import com.hostel.dto.TenantDTO;
import com.hostel.entity.TenantEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TenantService {
    private final List<TenantEntity> tenantList = new ArrayList<>();
    private int nextId = 3;

    public TenantService() {
        // Pre-seeded default tenants for demo
        tenantList.add(new TenantEntity(1, "Rahul Sharma", "tenant@college.edu", "+91 98111 22334",
                "password123", "Computer Science - Sem 5", 102, "B-201", 7500.0, "PAID"));

        tenantList.add(new TenantEntity(2, "Priya Patel", "priya@college.edu", "+91 98222 33445",
                "password123", "Information Technology - Sem 5", 103, "C-302", 6500.0, "DUE"));
    }

    public List<TenantDTO> getAllTenants() {
        List<TenantDTO> dtoList = new ArrayList<>();
        for (TenantEntity entity : tenantList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public TenantDTO getTenantById(int id) {
        for (TenantEntity entity : tenantList) {
            if (entity.getId() == id) {
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public TenantEntity getTenantEntityById(int id) {
        for (TenantEntity entity : tenantList) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    public TenantEntity getTenantByEmail(String email) {
        if (email == null) return null;
        for (TenantEntity entity : tenantList) {
            if (entity.getEmail() != null && entity.getEmail().equalsIgnoreCase(email.trim())) {
                return entity;
            }
        }
        return null;
    }

    public TenantDTO addTenant(TenantDTO dto) {
        TenantEntity entity = convertToEntity(dto);
        if (entity.getId() <= 0) {
            entity.setId(nextId++);
        }
        tenantList.add(entity);
        return convertToDTO(entity);
    }

    public TenantDTO updateTenant(int id, TenantDTO dto) {
        for (TenantEntity entity : tenantList) {
            if (entity.getId() == id) {
                if (dto.getName() != null) entity.setName(dto.getName());
                if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
                if (dto.getPhone() != null) entity.setPhone(dto.getPhone());
                if (dto.getCollegeOrCompany() != null) entity.setCollegeOrCompany(dto.getCollegeOrCompany());
                if (dto.getPassword() != null && !dto.getPassword().isEmpty() && !dto.getPassword().equals("******")) {
                    entity.setPassword(dto.getPassword());
                }
                if (dto.getAssignedRoomId() != null) {
                    entity.setAssignedRoomId(dto.getAssignedRoomId());
                }
                if (dto.getAssignedRoomNumber() != null) {
                    entity.setAssignedRoomNumber(dto.getAssignedRoomNumber());
                }
                if (dto.getMonthlyRent() != null && dto.getMonthlyRent() > 0) {
                    entity.setMonthlyRent(dto.getMonthlyRent());
                }
                if (dto.getRentStatus() != null) {
                    entity.setRentStatus(dto.getRentStatus());
                }
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public void updateRoomAssignment(int tenantId, int roomId, String roomNumber, double rentAmount) {
        for (TenantEntity entity : tenantList) {
            if (entity.getId() == tenantId) {
                entity.setAssignedRoomId(roomId);
                entity.setAssignedRoomNumber(roomNumber);
                entity.setMonthlyRent(rentAmount);
                entity.setRentStatus("DUE");
                break;
            }
        }
    }

    public void updateRentStatus(int tenantId, String status) {
        for (TenantEntity entity : tenantList) {
            if (entity.getId() == tenantId) {
                entity.setRentStatus(status);
                break;
            }
        }
    }

    public TenantDTO convertToDTO(TenantEntity entity) {
        TenantDTO dto = new TenantDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setPassword("******"); // mask password for security
        dto.setCollegeOrCompany(entity.getCollegeOrCompany());
        dto.setAssignedRoomId(entity.getAssignedRoomId());
        dto.setAssignedRoomNumber(entity.getAssignedRoomNumber());
        dto.setMonthlyRent(entity.getMonthlyRent());
        dto.setRentStatus(entity.getRentStatus());
        return dto;
    }

    public TenantEntity convertToEntity(TenantDTO dto) {
        TenantEntity entity = new TenantEntity();
        entity.setId(dto.getId() != null ? dto.getId() : 0);
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : null);
        entity.setPhone(dto.getPhone());
        entity.setPassword(dto.getPassword() != null && !dto.getPassword().trim().isEmpty() ? dto.getPassword().trim() : "password123");
        entity.setCollegeOrCompany(dto.getCollegeOrCompany());
        entity.setAssignedRoomId(dto.getAssignedRoomId());
        entity.setAssignedRoomNumber(dto.getAssignedRoomNumber());
        entity.setMonthlyRent(dto.getMonthlyRent() != null ? dto.getMonthlyRent() : 0.0);
        entity.setRentStatus(dto.getRentStatus() != null ? dto.getRentStatus() : "DUE");
        return entity;
    }
}
