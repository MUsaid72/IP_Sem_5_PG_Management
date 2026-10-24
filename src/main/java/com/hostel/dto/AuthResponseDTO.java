package com.hostel.dto;

public class AuthResponseDTO {
    private boolean success;
    private String message;
    private String role;
    private Object user;

    public AuthResponseDTO() {
    }

    public AuthResponseDTO(boolean success, String message, String role, Object user) {
        this.success = success;
        this.message = message;
        this.role = role;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Object getUser() {
        return user;
    }

    public void setUser(Object user) {
        this.user = user;
    }
}
