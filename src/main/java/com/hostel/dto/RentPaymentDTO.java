package com.hostel.dto;

public class RentPaymentDTO {
    private Integer id;
    private Integer tenantId;
    private String tenantName;
    private Integer roomId;
    private String roomNumber;
    private Double amount;
    private String month;
    private String paymentDate;
    private String paymentMethod;
    private String transactionId;
    private String status;

    public RentPaymentDTO() {
    }

    public RentPaymentDTO(Integer id, Integer tenantId, String tenantName, Integer roomId, String roomNumber,
                          Double amount, String month, String paymentDate, String paymentMethod,
                          String transactionId, String status) {
        this.id = id;
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.amount = amount;
        this.month = month;
        this.paymentDate = paymentDate;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.status = status;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public String getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(String paymentDate) {
        this.paymentDate = paymentDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
