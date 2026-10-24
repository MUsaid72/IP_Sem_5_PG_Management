package com.hostel.controller;

import com.hostel.dto.RentPaymentDTO;
import com.hostel.service.RentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rent")
@CrossOrigin(origins = "*")
public class RentController {

    @Autowired
    private RentService rentService;

    // Owner views all rent payment records
    @GetMapping("/payments")
    public List<RentPaymentDTO> getAllPayments() {
        return rentService.getAllPayments();
    }

    // Tenant views their payment history
    @GetMapping("/payments/tenant/{tenantId}")
    public List<RentPaymentDTO> getPaymentsByTenant(@PathVariable int tenantId) {
        return rentService.getPaymentsByTenant(tenantId);
    }

    // Tenant makes a rent payment
    @PostMapping("/pay")
    public RentPaymentDTO payRent(@RequestBody RentPaymentDTO dto) {
        return rentService.payRent(dto);
    }

    // Owner views rent financial summary stats
    @GetMapping("/stats")
    public Map<String, Object> getRentStats() {
        return rentService.getRentStats();
    }
}
