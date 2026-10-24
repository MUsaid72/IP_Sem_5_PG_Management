package HostelManagement.entity;

public class Room {

    private int id;
    private int ownerId;
    private String roomNumber;
    private String type;
    private double rentAmount;
    private String status;

    public Room() {
    }

    public Room(int id, int ownerId, String roomNumber, String type, double rentAmount, String status) {
        this.id = id;
        this.ownerId = ownerId;
        this.roomNumber = roomNumber;
        this.type = type;
        this.rentAmount = rentAmount;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(int ownerId) {
        this.ownerId = ownerId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(double rentAmount) {
        this.rentAmount = rentAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
