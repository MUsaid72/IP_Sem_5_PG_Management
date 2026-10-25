package com.hostel.service;

import com.hostel.dto.TenantDTO;
import com.hostel.entity.TenantEntity;
import com.hostel.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    public List<TenantDTO> getAllTenants() {
        List<TenantDTO> dtoList = new ArrayList<>();
        for (TenantEntity entity : tenantRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public TenantDTO getTenantById(int id) {
        return tenantRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public TenantEntity getTenantEntityById(int id) {
        return tenantRepository.findById(id).orElse(null);
    }

    public TenantEntity getTenantByEmail(String email) {
        if (email == null) return null;
        return tenantRepository.findByEmail(email.trim()).orElse(null);
    }

    @Transactional
    public TenantDTO addTenant(TenantDTO dto) {
        TenantEntity entity = convertToEntity(dto);
        if (entity.getId() <= 0) {
            entity.setId(0);
        }
        TenantEntity saved = tenantRepository.save(entity);
        return convertToDTO(saved);
    }

    @Transactional
    public TenantDTO updateTenant(int id, TenantDTO dto) {
        Optional<TenantEntity> opt = tenantRepository.findById(id);
        if (opt.isPresent()) {
            TenantEntity entity = opt.get();
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
            TenantEntity saved = tenantRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    @Transactional
    public void updateRoomAssignment(int tenantId, int roomId, String roomNumber, double rentAmount) {
        Optional<TenantEntity> opt = tenantRepository.findById(tenantId);
        if (opt.isPresent()) {
            TenantEntity entity = opt.get();
            entity.setAssignedRoomId(roomId);
            entity.setAssignedRoomNumber(roomNumber);
            entity.setMonthlyRent(rentAmount);
            entity.setRentStatus("DUE");
            tenantRepository.save(entity);
        }
    }

    @Transactional
    public void updateRentStatus(int tenantId, String status) {
        Optional<TenantEntity> opt = tenantRepository.findById(tenantId);
        if (opt.isPresent()) {
            TenantEntity entity = opt.get();
            entity.setRentStatus(status);
            tenantRepository.save(entity);
        }
    }

    public TenantDTO convertToDTO(TenantEntity entity) {
        if (entity == null) return null;
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
        if (dto == null) return null;
        TenantEntity entity = new TenantEntity();
        if (dto.getId() != null && dto.getId() > 0) {
            entity.setId(dto.getId());
        }
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
