package com.hostel.controller;

import com.hostel.dto.TenantApplicationDTO;
import com.hostel.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    // Tenant applies for a room
    @PostMapping("/apply")
    public TenantApplicationDTO applyForRoom(@RequestBody TenantApplicationDTO dto) {
        return applicationService.applyForRoom(dto);
    }

    // Owner views all applications
    @GetMapping
    public List<TenantApplicationDTO> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // Tenant views their applications
    @GetMapping("/tenant/{tenantId}")
    public List<TenantApplicationDTO> getApplicationsByTenant(@PathVariable int tenantId) {
        return applicationService.getApplicationsByTenant(tenantId);
    }

    // Owner approves application (room becomes OCCUPIED and unavailable in listing)
    @PutMapping("/{id}/approve")
    public TenantApplicationDTO approveApplication(@PathVariable int id) {
        return applicationService.approveApplication(id);
    }

    // Owner rejects application
    @PutMapping("/{id}/reject")
    public TenantApplicationDTO rejectApplication(@PathVariable int id) {
        return applicationService.rejectApplication(id);
    }
}
