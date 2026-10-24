package com.hostel.service;

import com.hostel.dto.AuthRequestDTO;
import com.hostel.dto.AuthResponseDTO;
import com.hostel.dto.OwnerDTO;
import com.hostel.dto.TenantDTO;
import com.hostel.entity.OwnerEntity;
import com.hostel.entity.TenantEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private OwnerService ownerService;

    @Autowired
    private TenantService tenantService;

    public AuthResponseDTO login(AuthRequestDTO req) {
        if (req == null || req.getEmail() == null || req.getPassword() == null) {
            return new AuthResponseDTO(false, "Email and password are required.", null, null);
        }

        String email = req.getEmail().trim();
        String password = req.getPassword().trim();
        String role = req.getRole() != null ? req.getRole().trim().toUpperCase() : "";

        // Check Owner
        if (role.isEmpty() || "OWNER".equals(role)) {
            OwnerEntity owner = ownerService.getOwnerByEmail(email);
            if (owner != null && owner.getPassword() != null && owner.getPassword().equals(password)) {
                OwnerDTO dto = ownerService.convertToDTO(owner);
                return new AuthResponseDTO(true, "Owner login successful! Welcome back, " + owner.getName(), "OWNER", dto);
            }
        }

        // Check Tenant
        if (role.isEmpty() || "TENANT".equals(role)) {
            TenantEntity tenant = tenantService.getTenantByEmail(email);
            if (tenant != null && tenant.getPassword() != null && tenant.getPassword().equals(password)) {
                TenantDTO dto = tenantService.convertToDTO(tenant);
                return new AuthResponseDTO(true, "Tenant login successful! Welcome, " + tenant.getName(), "TENANT", dto);
            }
        }

        return new AuthResponseDTO(false, "Invalid credentials. Please check your email and password.", null, null);
    }

    public AuthResponseDTO registerOwner(OwnerDTO dto) {
        if (dto == null || dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            return new AuthResponseDTO(false, "Email address is required.", null, null);
        }
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            return new AuthResponseDTO(false, "Full name is required.", null, null);
        }

        OwnerEntity existing = ownerService.getOwnerByEmail(dto.getEmail());
        if (existing != null) {
            return new AuthResponseDTO(false, "An owner with this email already exists.", null, null);
        }

        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            dto.setPassword("password123");
        }

        OwnerDTO created = ownerService.addOwner(dto);
        return new AuthResponseDTO(true, "Owner registered successfully!", "OWNER", created);
    }

    public AuthResponseDTO registerTenant(TenantDTO dto) {
        if (dto == null || dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
            return new AuthResponseDTO(false, "Email address is required.", null, null);
        }
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            return new AuthResponseDTO(false, "Full name is required.", null, null);
        }

        TenantEntity existing = tenantService.getTenantByEmail(dto.getEmail());
        if (existing != null) {
            return new AuthResponseDTO(false, "A tenant with this email already exists.", null, null);
        }

        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            dto.setPassword("password123");
        }

        TenantDTO created = tenantService.addTenant(dto);
        return new AuthResponseDTO(true, "Tenant registered successfully!", "TENANT", created);
    }

    public OwnerDTO getOwnerProfile(int id) {
        OwnerDTO owner = ownerService.getOwnerById(id);
        if (owner != null) return owner;
        return ownerService.getAllOwners().isEmpty() ? null : ownerService.getAllOwners().get(0);
    }
}
