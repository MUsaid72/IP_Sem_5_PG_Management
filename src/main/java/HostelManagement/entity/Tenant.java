package HostelManagement.entity;

public class Tenant {

    private int id;
    private String name;
    private String email;
    private String phone;
    private int roomId;
    private String status;
    private String applicationDate;

    public Tenant() {
    }

    public Tenant(int id, String name, String email, String phone, int roomId, String status, String applicationDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.roomId = roomId;
        this.status = status;
        this.applicationDate = applicationDate;
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

    public int getRoomId() {
        return roomId;
    }

    public void setRoomId(int roomId) {
        this.roomId = roomId;
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
