package HostelManagement.dto;

public class ComplaintDTO {

    private int id;
    private int tenantId;
    private String title;
    private String description;
    private String status;
    private String createdDate;

    public ComplaintDTO() {
    }

    public ComplaintDTO(int id, int tenantId, String title, String description, String status, String createdDate) {
        this.id = id;
        this.tenantId = tenantId;
        this.title = title;
        this.description = description;
        this.status = status;
        this.createdDate = createdDate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }
}
