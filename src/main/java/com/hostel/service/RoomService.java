package com.hostel.service;

import com.hostel.dto.RoomDTO;
import com.hostel.entity.RoomEntity;
import com.hostel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // CREATE
    @Transactional
    public RoomDTO addRoom(RoomDTO dto) {
        RoomEntity entity = convertToEntity(dto);
        if (entity.getId() <= 0) {
            entity.setId(0);
        }
        if (entity.getStatus() == null || entity.getStatus().isEmpty()) {
            entity.setStatus("AVAILABLE");
        }
        if (entity.getImageUrl() == null || entity.getImageUrl().isEmpty()) {
            entity.setImageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80");
        }
        RoomEntity saved = roomRepository.save(entity);
        return convertToDTO(saved);
    }

    // READ ALL
    public List<RoomDTO> getAllRooms() {
        List<RoomDTO> dtoList = new ArrayList<>();
        for (RoomEntity entity : roomRepository.findAll()) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    // READ AVAILABLE ONLY (for tenants searching)
    public List<RoomDTO> getAvailableRooms() {
        List<RoomDTO> dtoList = new ArrayList<>();
        for (RoomEntity entity : roomRepository.findByStatus("AVAILABLE")) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    // READ BY ID
    public RoomDTO getRoomById(int id) {
        return roomRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    public RoomEntity getRoomEntityById(int id) {
        return roomRepository.findById(id).orElse(null);
    }

    // UPDATE
    @Transactional
    public RoomDTO updateRoom(int id, RoomDTO dto) {
        Optional<RoomEntity> opt = roomRepository.findById(id);
        if (opt.isPresent()) {
            RoomEntity entity = opt.get();
            if (dto.getRoomNumber() != null) entity.setRoomNumber(dto.getRoomNumber());
            if (dto.getRoomType() != null) entity.setRoomType(dto.getRoomType());
            if (dto.getRentAmount() != null) entity.setRentAmount(dto.getRentAmount());
            if (dto.getSecurityDeposit() != null) entity.setSecurityDeposit(dto.getSecurityDeposit());
            if (dto.getStatus() != null) entity.setStatus(dto.getStatus());
            if (dto.getAmenities() != null) entity.setAmenities(dto.getAmenities());
            if (dto.getDescription() != null) entity.setDescription(dto.getDescription());
            if (dto.getImageUrl() != null && !dto.getImageUrl().isEmpty()) {
                entity.setImageUrl(dto.getImageUrl());
            }
            RoomEntity saved = roomRepository.save(entity);
            return convertToDTO(saved);
        }
        return null;
    }

    // ASSIGN ROOM (Called when booking/application is approved)
    @Transactional
    public boolean assignRoomToTenant(int roomId, int tenantId, String tenantName) {
        Optional<RoomEntity> opt = roomRepository.findById(roomId);
        if (opt.isPresent()) {
            RoomEntity entity = opt.get();
            entity.setStatus("OCCUPIED"); // marks as unavailable
            entity.setCurrentTenantId(tenantId);
            entity.setCurrentTenantName(tenantName);
            roomRepository.save(entity);
            return true;
        }
        return false;
    }

    // VACATE ROOM
    @Transactional
    public boolean vacateRoom(int roomId) {
        Optional<RoomEntity> opt = roomRepository.findById(roomId);
        if (opt.isPresent()) {
            RoomEntity entity = opt.get();
            entity.setStatus("AVAILABLE");
            entity.setCurrentTenantId(null);
            entity.setCurrentTenantName(null);
            roomRepository.save(entity);
            return true;
        }
        return false;
    }

    // DELETE
    @Transactional
    public String deleteRoom(int id) {
        Optional<RoomEntity> opt = roomRepository.findById(id);
        if (opt.isPresent()) {
            String roomNum = opt.get().getRoomNumber();
            roomRepository.deleteById(id);
            return "Room " + roomNum + " deleted successfully";
        }
        return "Room not found";
    }

    public RoomDTO convertToDTO(RoomEntity entity) {
        if (entity == null) return null;
        RoomDTO dto = new RoomDTO();
        dto.setId(entity.getId());
        dto.setRoomNumber(entity.getRoomNumber());
        dto.setRoomType(entity.getRoomType());
        dto.setRentAmount(entity.getRentAmount());
        dto.setSecurityDeposit(entity.getSecurityDeposit());
        dto.setStatus(entity.getStatus());
        dto.setAmenities(entity.getAmenities());
        dto.setDescription(entity.getDescription());
        dto.setImageUrl(entity.getImageUrl());
        dto.setOwnerId(entity.getOwnerId());
        dto.setCurrentTenantId(entity.getCurrentTenantId());
        dto.setCurrentTenantName(entity.getCurrentTenantName());
        return dto;
    }

    public RoomEntity convertToEntity(RoomDTO dto) {
        if (dto == null) return null;
        RoomEntity entity = new RoomEntity();
        if (dto.getId() != null && dto.getId() > 0) {
            entity.setId(dto.getId());
        }
        entity.setRoomNumber(dto.getRoomNumber());
        entity.setRoomType(dto.getRoomType());
        entity.setRentAmount(dto.getRentAmount() != null ? dto.getRentAmount() : 0.0);
        entity.setSecurityDeposit(dto.getSecurityDeposit() != null ? dto.getSecurityDeposit() : 0.0);
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "AVAILABLE");
        entity.setAmenities(dto.getAmenities());
        entity.setDescription(dto.getDescription());
        entity.setImageUrl(dto.getImageUrl());
        entity.setOwnerId(dto.getOwnerId() != null && dto.getOwnerId() > 0 ? dto.getOwnerId() : 1);
        entity.setCurrentTenantId(dto.getCurrentTenantId());
        entity.setCurrentTenantName(dto.getCurrentTenantName());
        return entity;
    }
}
