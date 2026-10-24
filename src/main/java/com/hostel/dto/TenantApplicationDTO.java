package com.hostel.dto;

public class TenantApplicationDTO {
    private Integer id;
    private Integer tenantId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;
    private Integer roomId;
    private String roomNumber;
    private Double rentAmount;
    private String message;
    private String status;
    private String applicationDate;

    public TenantApplicationDTO() {
    }

    public TenantApplicationDTO(Integer id, Integer tenantId, String tenantName, String tenantEmail, String tenantPhone,
                                Integer roomId, String roomNumber, Double rentAmount, String message,
                                String status, String applicationDate) {
        this.id = id;
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.tenantEmail = tenantEmail;
        this.tenantPhone = tenantPhone;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.rentAmount = rentAmount;
        this.message = message;
        this.status = status;
        this.applicationDate = applicationDate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTenantId() {
        return tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public String getTenantEmail() {
        return tenantEmail;
    }

    public void setTenantEmail(String tenantEmail) {
        this.tenantEmail = tenantEmail;
    }

    public String getTenantPhone() {
        return tenantPhone;
    }

    public void setTenantPhone(String tenantPhone) {
        this.tenantPhone = tenantPhone;
    }

    public Integer getRoomId() {
        return roomId;
    }

    public void setRoomId(Integer roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(String applicationDate) {
        this.applicationDate = applicationDate;
    }
}
