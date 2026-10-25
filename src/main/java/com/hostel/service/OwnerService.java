package com.hostel.service;

import com.hostel.dto.OwnerDTO;
import com.hostel.entity.OwnerEntity;
import com.hostel.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OwnerService {

    @Autowired
    private OwnerRepository ownerRepository;

    public List<OwnerDTO> getAllOwners() {
        List<OwnerDTO> dtoList = new ArrayList<>();
        for (OwnerEntity entity : ownerRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    public OwnerDTO getOwnerById(int id) {
        return ownerRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public OwnerEntity getOwnerEntityById(int id) {
        return ownerRepository.findById(id).orElse(null);
    }

    public OwnerEntity getOwnerByEmail(String email) {
        if (email == null) return null;
        return ownerRepository.findByEmail(email.trim()).orElse(null);
    }

    @Transactional
    public OwnerDTO addOwner(OwnerDTO dto) {
        OwnerEntity entity = convertToEntity(dto);
        // Clear manual id if 0 so JPA / MySQL auto-generates ID
        if (entity.getId() <= 0) {
            entity.setId(0);
        }
        OwnerEntity saved = ownerRepository.save(entity);
        return convertToDTO(saved);
    }

    @Transactional
    public OwnerDTO updateOwner(int id, OwnerDTO dto) {
        Optional<OwnerEntity> opt = ownerRepository.findById(id);
        if (opt.isPresent()) {
            OwnerEntity entity = opt.get();
            if (dto.getName() != null) entity.setName(dto.getName());
            if (dto.getEmail() != null) entity.setEmail(dto.getEmail());
            if (dto.getPhone() != null) entity.setPhone(dto.getPhone());
            if (dto.getHostelName() != null) entity.setHostelName(dto.getHostelName());
            if (dto.getAddress() != null) entity.setAddress(dto.getAddress());
            if (dto.getPassword() != null && !dto.getPassword().isEmpty() && !dto.getPassword().equals("******")) {
                entity.setPassword(dto.getPassword());
            }
            OwnerEntity saved = ownerRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    @Transactional
    public String deleteOwner(int id) {
        if (ownerRepository.existsById(id)) {
            ownerRepository.deleteById(id);
            return "Owner deleted successfully";
        }
        return "Owner not found";
    }

    public OwnerDTO convertToDTO(OwnerEntity entity) {
        if (entity == null) return null;
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
        if (dto == null) return null;
        OwnerEntity entity = new OwnerEntity();
        if (dto.getId() != null && dto.getId() > 0) {
            entity.setId(dto.getId());
        }
        entity.setName(dto.getName());
        entity.setEmail(dto.getEmail() != null ? dto.getEmail().trim() : null);
        entity.setPhone(dto.getPhone());
        entity.setPassword(dto.getPassword() != null && !dto.getPassword().isEmpty() ? dto.getPassword().trim() : "password123");
        entity.setHostelName(dto.getHostelName() != null ? dto.getHostelName() : "My PG & Hostel");
        entity.setAddress(dto.getAddress() != null ? dto.getAddress() : "Campus Lane");
        return entity;
    }
}
