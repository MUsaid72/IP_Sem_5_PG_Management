package com.hostel.entity;

public class TenantApplicationEntity {
    private int id;
    private int tenantId;
    private String tenantName;
    private String tenantEmail;
    private String tenantPhone;
    private int roomId;
    private String roomNumber;
    private double rentAmount;
    private String message;
    private String status; // PENDING, APPROVED, REJECTED
    private String applicationDate;

    public TenantApplicationEntity() {
    }

    public TenantApplicationEntity(int id, int tenantId, String tenantName, String tenantEmail, String tenantPhone,
                                   int roomId, String roomNumber, double rentAmount, String message,
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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getTenantId() {
        return tenantId;
    }

    public void setTenantId(int tenantId) {
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

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(double rentAmount) {
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
