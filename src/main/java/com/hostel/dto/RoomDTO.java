package com.hostel.dto;

public class RoomDTO {
    private Integer id;
    private String roomNumber;
    private String roomType;
    private Double rentAmount;
    private Double securityDeposit;
    private String status;
    private String amenities;
    private String description;
    private String imageUrl;
    private Integer ownerId;
    private Integer currentTenantId;
    private String currentTenantName;

    public RoomDTO() {
    }

    public RoomDTO(Integer id, String roomNumber, String roomType, Double rentAmount, Double securityDeposit,
                   String status, String amenities, String description, String imageUrl,
                   Integer ownerId, Integer currentTenantId, String currentTenantName) {
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
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

    public Double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public Double getSecurityDeposit() {
        return securityDeposit;
    }

    public void setSecurityDeposit(Double securityDeposit) {
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

    public Integer getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Integer ownerId) {
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
