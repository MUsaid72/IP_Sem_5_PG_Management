package com.hostel.service;

import com.hostel.dto.OwnerDTO;
import com.hostel.entity.OwnerEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerService {

    private final List<OwnerEntity> ownerList = new ArrayList<>();
    private int nextId = 2;

    public OwnerService() {
        // Pre-seeded default owner for demo
        ownerList.add(new OwnerEntity(1, "Vikram Malhotra", "owner@hostel.com", "+91 98765 43210",
                "password123", "Shree Sai Royal PG & Hostels", "Plot 42, Knowledge Park III, Greater Noida"));
    }

    public List<OwnerDTO> getAllOwners() {
        List<OwnerDTO> dtoList = new ArrayList<>();
        for (OwnerEntity entity : ownerList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public OwnerDTO getOwnerById(int id) {
        for (OwnerEntity entity : ownerList) {
            if (entity.getId() == id) {
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public OwnerEntity getOwnerEntityById(int id) {
        for (OwnerEntity entity : ownerList) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    public OwnerEntity getOwnerByEmail(String email) {
        if (email == null) return null;
        for (OwnerEntity entity : ownerList) {
            if (entity.getEmail() != null && entity.getEmail().equalsIgnoreCase(email.trim())) {
                return entity;
            }
        }
        return null;
    }

    public OwnerDTO addOwner(OwnerDTO dto) {
        OwnerEntity entity = convertToEntity(dto);
        if (entity.getId() <= 0) {
            entity.setId(nextId++);
        }
        ownerList.add(entity);
        return convertToDTO(entity);
    }

    public OwnerDTO updateOwner(int id, OwnerDTO dto) {
        for (OwnerEntity entity : ownerList) {
            if (entity.getId() == id) {
                if (dto.getName() != null) entity.setName(dto.getName());
                if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
                if (dto.getPhone() != null) entity.setPhone(dto.getPhone());
                if (dto.getHostelName() != null) entity.setHostelName(dto.getHostelName());
                if (dto.getAddress() != null) entity.setAddress(dto.getAddress());
                if (dto.getPassword() != null && !dto.getPassword().isEmpty() && !dto.getPassword().equals("******")) {
                    entity.setPassword(dto.getPassword());
                }
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public String deleteOwner(int id) {
        for (OwnerEntity entity : ownerList) {
            if (entity.getId() == id) {
                ownerList.remove(entity);
                return "Owner deleted successfully";
            }
        }
        return "Owner not found";
    }

    public OwnerDTO convertToDTO(OwnerEntity entity) {
        OwnerDTO dto = new OwnerDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setPassword("******");
        dto.setHostelName(entity.getHostelName());
        dto.setAddress(entity.getAddress());
        return dto;
    }

    public OwnerEntity convertToEntity(OwnerDTO dto) {
        OwnerEntity entity = new OwnerEntity();
        entity.setId(dto.getId() != null ? dto.getId() : 0);
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : null);
        entity.setPhone(dto.getPhone());
        entity.setPassword(dto.getPassword() != null && !dto.getPassword().isEmpty() ? dto.getPassword().trim() : "password123");
        entity.setHostelName(dto.getHostelName() != null ? dto.getHostelName() : "My PG & Hostel");
        entity.setAddress(dto.getAddress() != null ? dto.getAddress() : "Campus Lane");
        return entity;
    }
}
