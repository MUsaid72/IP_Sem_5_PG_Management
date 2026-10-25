package com.hostel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class RoomEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true, length = 50)
    private String roomNumber;

    @Column(nullable = false, length = 100)
    private String roomType;

    private double rentAmount;
    private double securityDeposit;

    @Column(nullable = false, length = 50)
    private String status; // AVAILABLE, OCCUPIED, UNDER_MAINTENANCE

    @Column(length = 1000)
    private String amenities;

    @Column(length = 2000)
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    private int ownerId;
    private Integer currentTenantId;
    private String currentTenantName;

    public RoomEntity() {
    }

    public RoomEntity(int id, String roomNumber, String roomType, double rentAmount, double securityDeposit,
                      String status, String amenities, String description, String imageUrl,
                      int ownerId, Integer currentTenantId, String currentTenantName) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.rentAmount = rentAmount;
        this.securityDeposit = securityDeposit;
        this.status = status;
        this.amenities = amenities;
        this.description = description;
        this.imageUrl = imageUrl;
        this.ownerId = ownerId;
        this.currentTenantId = currentTenantId;
        this.currentTenantName = currentTenantName;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(double securityDeposit) {
        this.securityDeposit = securityDeposit;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public Integer getCurrentTenantId() {
        return currentTenantId;
    }

    public void setCurrentTenantId(Integer currentTenantId) {
        this.currentTenantId = currentTenantId;
    }

    public String getCurrentTenantName() {
        return currentTenantName;
    }

    public void setCurrentTenantName(String currentTenantName) {
        this.currentTenantName = currentTenantName;
    }
}
