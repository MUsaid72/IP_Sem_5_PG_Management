package com.hostel.controller;

import com.hostel.dto.TenantDTO;
import com.hostel.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @GetMapping
    public List<TenantDTO> getAllTenants() {
        return tenantService.getAllTenants();
    }

    @GetMapping("/{id}")
    public TenantDTO getTenantById(@PathVariable int id) {
        return tenantService.getTenantById(id);
    }

    @PostMapping
    public TenantDTO addTenant(@RequestBody TenantDTO dto) {
        return tenantService.addTenant(dto);
    }

    @PutMapping("/{id}")
    public TenantDTO updateTenant(@PathVariable int id, @RequestBody TenantDTO dto) {
        return tenantService.updateTenant(id, dto);
    }
}
