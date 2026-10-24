package com.hostel.controller;

import com.hostel.dto.ComplaintDTO;
import com.hostel.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    // Tenant files a new complaint
    @PostMapping
    public ComplaintDTO fileComplaint(@RequestBody ComplaintDTO dto) {
        return complaintService.fileComplaint(dto);
    }

    // Owner views all complaints
    @GetMapping
    public List<ComplaintDTO> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    // Tenant views their complaints
    @GetMapping("/tenant/{tenantId}")
    public List<ComplaintDTO> getComplaintsByTenant(@PathVariable int tenantId) {
        return complaintService.getComplaintsByTenant(tenantId);
    }

    // Get complaint by ID
    @GetMapping("/{id}")
    public ComplaintDTO getComplaintById(@PathVariable int id) {
        return complaintService.getComplaintById(id);
    }

    // Owner updates complaint status & notes
    @PutMapping("/{id}/status")
    public ComplaintDTO updateStatus(@PathVariable int id, @RequestBody Map<String, String> body) {
        String status = body.getOrDefault("status", "IN_PROGRESS");
        String notes = body.getOrDefault("ownerNotes", "");
        return complaintService.updateComplaintStatus(id, status, notes);
    }
}
