package com.hostel.controller;

import com.hostel.dto.AuthRequestDTO;
import com.hostel.dto.AuthResponseDTO;
import com.hostel.dto.OwnerDTO;
import com.hostel.dto.TenantDTO;
import com.hostel.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody AuthRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/register/owner")
    public AuthResponseDTO registerOwner(@RequestBody OwnerDTO dto) {
        return authService.registerOwner(dto);
    }

    @PostMapping("/register/tenant")
    public AuthResponseDTO registerTenant(@RequestBody TenantDTO dto) {
        return authService.registerTenant(dto);
    }

    @GetMapping("/owner/{id}")
    public OwnerDTO getOwnerProfile(@PathVariable int id) {
        return authService.getOwnerProfile(id);
    }
}
