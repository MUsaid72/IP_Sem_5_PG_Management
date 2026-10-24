package HostelManagement.controller;

import HostelManagement.dto.OwnerDTO;
import HostelManagement.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/owners", "/owners"})
@CrossOrigin(origins = "*")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    @PostMapping
    public OwnerDTO addOwner(@RequestBody OwnerDTO ownerDTO) {
        return ownerService.addOwner(ownerDTO);
    }

    @GetMapping
    public List<OwnerDTO> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @GetMapping("/{id}")
    public OwnerDTO getOwnerById(@PathVariable int id) {
        return ownerService.getOwnerById(id);
    }

    @PutMapping("/{id}")
    public OwnerDTO updateOwner(@PathVariable int id, @RequestBody OwnerDTO ownerDTO) {
        return ownerService.updateOwner(id, ownerDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteOwner(@PathVariable int id) {
        return ownerService.deleteOwner(id);
    }
}
