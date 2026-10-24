package HostelManagement.controller;

import HostelManagement.dto.ComplaintDTO;
import HostelManagement.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/complaints", "/complaints"})
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PostMapping
    public ComplaintDTO addComplaint(@RequestBody ComplaintDTO complaintDTO) {
        return complaintService.addComplaint(complaintDTO);
    }

    @GetMapping
    public List<ComplaintDTO> getAllComplaints() {
        return complaintService.getAllComplaints();
    }

    @GetMapping("/{id}")
    public ComplaintDTO getComplaintById(@PathVariable int id) {
        return complaintService.getComplaintById(id);
    }

    @PutMapping("/{id}")
    public ComplaintDTO updateComplaint(@PathVariable int id, @RequestBody ComplaintDTO complaintDTO) {
        return complaintService.updateComplaint(id, complaintDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteComplaint(@PathVariable int id) {
        return complaintService.deleteComplaint(id);
    }
}
