package com.hostel.controller;

import com.hostel.dto.OwnerDTO;
import com.hostel.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/owners")
@CrossOrigin(origins = "*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @GetMapping
    public List<OwnerDTO> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public OwnerDTO getOwnerById(@PathVariable int id) {
        return ownerService.getOwnerById(id);
    }

    @PostMapping
    public OwnerDTO addOwner(@RequestBody OwnerDTO dto) {
        return ownerService.addOwner(dto);
    }

    @PutMapping("/{id}")
    public OwnerDTO updateOwner(@PathVariable int id, @RequestBody OwnerDTO dto) {
        return ownerService.updateOwner(id, dto);
    }

    @DeleteMapping("/{id}")
    public String deleteOwner(@PathVariable int id) {
        return ownerService.deleteOwner(id);
    }
}
