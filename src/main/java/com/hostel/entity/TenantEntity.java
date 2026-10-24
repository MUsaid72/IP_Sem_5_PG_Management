package com.hostel.entity;

public class TenantEntity {
    private int id;
    private String name;
    private String email;
    private String phone;
    private String password;
    private String collegeOrCompany;
    private Integer assignedRoomId;
    private String assignedRoomNumber;
    private double monthlyRent;
    private String rentStatus; // PAID, DUE, OVERDUE

    public TenantEntity() {
    }

    public TenantEntity(int id, String name, String email, String phone, String password,
                        String collegeOrCompany, Integer assignedRoomId, String assignedRoomNumber,
                        double monthlyRent, String rentStatus) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.collegeOrCompany = collegeOrCompany;
        this.assignedRoomId = assignedRoomId;
        this.assignedRoomNumber = assignedRoomNumber;
        this.monthlyRent = monthlyRent;
        this.rentStatus = rentStatus;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCollegeOrCompany() {
        return collegeOrCompany;
    }

    public void setCollegeOrCompany(String collegeOrCompany) {
        this.collegeOrCompany = collegeOrCompany;
    }

    public Integer getAssignedRoomId() {
        return assignedRoomId;
    }

    public void setAssignedRoomId(Integer assignedRoomId) {
        this.assignedRoomId = assignedRoomId;
    }

    public String getAssignedRoomNumber() {
        return assignedRoomNumber;
    }

    public void setAssignedRoomNumber(String assignedRoomNumber) {
        this.assignedRoomNumber = assignedRoomNumber;
    }

    public double getMonthlyRent() {
        return monthlyRent;
    }

    public void setMonthlyRent(double monthlyRent) {
        this.monthlyRent = monthlyRent;
    }

    public String getRentStatus() {
        return rentStatus;
    }

    public void setRentStatus(String rentStatus) {
        this.rentStatus = rentStatus;
    }
}
