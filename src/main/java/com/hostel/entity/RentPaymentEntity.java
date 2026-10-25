package com.hostel.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "rent_payments")
public class RentPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int tenantId;
    private String tenantName;
    private int roomId;
    private String roomNumber;
    private double amount;
    private String month;
    private String paymentDate;
    private String paymentMethod; // UPI, Net Banking, Cash, Card
    private String transactionId;

    @Column(length = 30)
    private String status; // PAID, PENDING, FAILED

    public RentPaymentEntity() {
    }

    public RentPaymentEntity(int id, int tenantId, String tenantName, int roomId, String roomNumber,
                             double amount, String month, String paymentDate, String paymentMethod,
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

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
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
