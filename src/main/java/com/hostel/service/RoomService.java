package com.hostel.service;

import com.hostel.dto.RoomDTO;
import com.hostel.entity.RoomEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {
    private final List<RoomEntity> roomList = new ArrayList<>();
    private int nextId = 107;

    public RoomService() {
        // Pre-seeded rooms for demonstration
        roomList.add(new RoomEntity(101, "A-101", "Single Sharing", 9500.0, 10000.0,
                "AVAILABLE", "Attached Washroom, Air Conditioning, High-speed Wi-Fi, Study Desk, Balcony",
                "Spacious premium single-sharing room on the 1st floor with ample natural sunlight and garden view.",
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80",
                1, null, null));

        roomList.add(new RoomEntity(102, "B-201", "Double Sharing", 7500.0, 8000.0,
                "OCCUPIED", "Air Conditioning, Wi-Fi, Balcony, Attached Washroom, Wardrobes",
                "Deluxe double sharing room currently leased to Rahul Sharma.",
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
                1, 1, "Rahul Sharma"));

        roomList.add(new RoomEntity(103, "C-302", "Double Sharing", 6500.0, 7000.0,
                "OCCUPIED", "Ceiling Fan, High-speed Wi-Fi, Attached Washroom, Personal Study Tables",
                "Standard double-sharing room currently leased to Priya Patel.",
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
                1, 2, "Priya Patel"));

        roomList.add(new RoomEntity(104, "A-104", "Single Sharing", 11500.0, 12000.0,
                "AVAILABLE", "Air Conditioning, Smart TV, Mini Fridge, Attached Luxury Bath, High-speed Wi-Fi",
                "Executive single suite with premium wooden furnishings and housekeeping.",
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
                1, null, null));

        roomList.add(new RoomEntity(105, "B-205", "Triple Sharing", 5200.0, 6000.0,
                "AVAILABLE", "High-speed Wi-Fi, Balcony, Geyser, Triple Wardrobes, Power Backup",
                "Budget-friendly spacious triple-sharing room ideal for college students.",
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
                1, null, null));

        roomList.add(new RoomEntity(106, "D-401", "Double Sharing", 6800.0, 7500.0,
                "UNDER_MAINTENANCE", "Air Conditioning, Wi-Fi, Attached Washroom",
                "Scheduled for fresh painting, tile polishing, and AC servicing.",
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
                1, null, null));
    }

    // CREATE
    public RoomDTO addRoom(RoomDTO dto) {
        RoomEntity entity = convertToEntity(dto);
        if (entity.getId() <= 0) {
            entity.setId(nextId++);
        }
        if (entity.getStatus() == null || entity.getStatus().isEmpty()) {
            entity.setStatus("AVAILABLE");
        }
        if (entity.getImageUrl() == null || entity.getImageUrl().isEmpty()) {
            entity.setImageUrl("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80");
        }
        roomList.add(entity);
        return convertToDTO(entity);
    }

    // READ ALL
    public List<RoomDTO> getAllRooms() {
        List<RoomDTO> dtoList = new ArrayList<>();
        for (RoomEntity entity : roomList) {
            dtoList.add(convertToDTO(entity));
        }
        return dtoList;
    }

    // READ AVAILABLE ONLY (for tenants searching)
    public List<RoomDTO> getAvailableRooms() {
        List<RoomDTO> dtoList = new ArrayList<>();
        for (RoomEntity entity : roomList) {
            if ("AVAILABLE".equalsIgnoreCase(entity.getStatus())) {
                dtoList.add(convertToDTO(entity));
            }
        }
        return dtoList;
    }

    // READ BY ID
    public RoomDTO getRoomById(int id) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == id) {
                return convertToDTO(entity);
            }
        }
        return null;
    }

    public RoomEntity getRoomEntityById(int id) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == id) {
                return entity;
            }
        }
        return null;
    }

    // UPDATE
    public RoomDTO updateRoom(int id, RoomDTO dto) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == id) {
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
                return convertToDTO(entity);
            }
        }
        return null;
    }

    // ASSIGN ROOM (Called when booking/application is approved)
    public boolean assignRoomToTenant(int roomId, int tenantId, String tenantName) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == roomId) {
                entity.setStatus("OCCUPIED"); // marks as unavailable
                entity.setCurrentTenantId(tenantId);
                entity.setCurrentTenantName(tenantName);
                return true;
            }
        }
        return false;
    }

    // VACATE ROOM
    public boolean vacateRoom(int roomId) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == roomId) {
                entity.setStatus("AVAILABLE");
                entity.setCurrentTenantId(null);
                entity.setCurrentTenantName(null);
                return true;
            }
        }
        return false;
    }

    // DELETE
    public String deleteRoom(int id) {
        for (RoomEntity entity : roomList) {
            if (entity.getId() == id) {
                roomList.remove(entity);
                return "Room " + entity.getRoomNumber() + " deleted successfully";
            }
        }
        return "Room not found";
    }

    public RoomDTO convertToDTO(RoomEntity entity) {
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
        RoomEntity entity = new RoomEntity();
        entity.setId(dto.getId() != null ? dto.getId() : 0);
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
