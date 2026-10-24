package com.hostel.dto;

public class ComplaintDTO {
    private Integer id;
    private Integer tenantId;
    private String tenantName;
    private String roomNumber;
    private String category;
    private String title;
    private String description;
    private String priority;
    private String status;
    private String ownerNotes;
    private String createdDate;
    private String resolvedDate;

    public ComplaintDTO() {
    }

    public ComplaintDTO(Integer id, Integer tenantId, String tenantName, String roomNumber, String category,
                        String title, String description, String priority, String status,
                        String ownerNotes, String createdDate, String resolvedDate) {
        this.id = id;
        this.tenantId = tenantId;
        this.tenantName = tenantName;
        this.roomNumber = roomNumber;
        this.category = category;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.ownerNotes = ownerNotes;
        this.createdDate = createdDate;
        this.resolvedDate = resolvedDate;
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

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOwnerNotes() {
        return ownerNotes;
    }

    public void setOwnerNotes(String ownerNotes) {
        this.ownerNotes = ownerNotes;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public String getResolvedDate() {
        return resolvedDate;
    }

    public void setResolvedDate(String resolvedDate) {
        this.resolvedDate = resolvedDate;
    }
}
