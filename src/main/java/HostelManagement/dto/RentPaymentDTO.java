package HostelManagement.dto;

public class RentPaymentDTO {

    private int id;
    private int tenantId;
    private double amount;
    private String month;
    private String paymentDate;
    private String status;

    public RentPaymentDTO() {
    }

    public RentPaymentDTO(int id, int tenantId, double amount, String month, String paymentDate, String status) {
        this.id = id;
        this.tenantId = tenantId;
        this.amount = amount;
        this.month = month;
        this.paymentDate = paymentDate;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
