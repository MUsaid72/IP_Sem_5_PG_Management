package HostelManagement.controller;

import HostelManagement.dto.TenantDTO;
import HostelManagement.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/tenants", "/tenants"})
@CrossOrigin(origins = "*")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping
    public TenantDTO addTenant(@RequestBody TenantDTO tenantDTO) {
        return tenantService.addTenant(tenantDTO);
    }

    @GetMapping
    public List<TenantDTO> getAllTenants() {
        return tenantService.getAllTenants();
    }

    @GetMapping("/{id}")
    public TenantDTO getTenantById(@PathVariable int id) {
        return tenantService.getTenantById(id);
    }

    @PutMapping("/{id}")
    public TenantDTO updateTenant(@PathVariable int id, @RequestBody TenantDTO tenantDTO) {
        return tenantService.updateTenant(id, tenantDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteTenant(@PathVariable int id) {
        return tenantService.deleteTenant(id);
    }
}
