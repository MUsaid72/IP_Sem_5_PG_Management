package HostelManagement.service;

import HostelManagement.dto.TenantDTO;
import HostelManagement.entity.Tenant;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TenantService {

    private List<Tenant> tenantList = new ArrayList<>();

    public TenantDTO addTenant(TenantDTO tenantDTO) {
        Tenant tenant = new Tenant();
        tenant.setId(tenantDTO.getId());
        tenant.setName(tenantDTO.getName());
        tenant.setEmail(tenantDTO.getEmail());
        tenant.setPhone(tenantDTO.getPhone());
        tenant.setRoomId(tenantDTO.getRoomId());
        tenant.setStatus(tenantDTO.getStatus());
        tenant.setApplicationDate(tenantDTO.getApplicationDate());
        tenantList.add(tenant);

        TenantDTO responseDTO = new TenantDTO();
        responseDTO.setId(tenant.getId());
        responseDTO.setName(tenant.getName());
        responseDTO.setEmail(tenant.getEmail());
        responseDTO.setPhone(tenant.getPhone());
        responseDTO.setRoomId(tenant.getRoomId());
        responseDTO.setStatus(tenant.getStatus());
        responseDTO.setApplicationDate(tenant.getApplicationDate());
        return responseDTO;
    }

    public List<TenantDTO> getAllTenants() {
        List<TenantDTO> tenantDTOList = new ArrayList<>();
        for (Tenant tenant : tenantList) {
            TenantDTO tenantDTO = new TenantDTO();
            tenantDTO.setId(tenant.getId());
            tenantDTO.setName(tenant.getName());
            tenantDTO.setEmail(tenant.getEmail());
            tenantDTO.setPhone(tenant.getPhone());
            tenantDTO.setRoomId(tenant.getRoomId());
            tenantDTO.setStatus(tenant.getStatus());
            tenantDTO.setApplicationDate(tenant.getApplicationDate());
            tenantDTOList.add(tenantDTO);
        }
        return tenantDTOList;
    }

    public TenantDTO getTenantById(int id) {
        for (Tenant tenant : tenantList) {
            if (tenant.getId() == id) {
                TenantDTO tenantDTO = new TenantDTO();
                tenantDTO.setId(tenant.getId());
                tenantDTO.setName(tenant.getName());
                tenantDTO.setEmail(tenant.getEmail());
                tenantDTO.setPhone(tenant.getPhone());
                tenantDTO.setRoomId(tenant.getRoomId());
                tenantDTO.setStatus(tenant.getStatus());
                tenantDTO.setApplicationDate(tenant.getApplicationDate());
                return tenantDTO;
            }
        }
        return null;
    }

    public TenantDTO updateTenant(int id, TenantDTO tenantDTO) {
        for (Tenant tenant : tenantList) {
            if (tenant.getId() == id) {
                tenant.setName(tenantDTO.getName());
                tenant.setEmail(tenantDTO.getEmail());
                tenant.setPhone(tenantDTO.getPhone());
                tenant.setRoomId(tenantDTO.getRoomId());
                tenant.setStatus(tenantDTO.getStatus());
                tenant.setApplicationDate(tenantDTO.getApplicationDate());

                TenantDTO responseDTO = new TenantDTO();
                responseDTO.setId(tenant.getId());
                responseDTO.setName(tenant.getName());
                responseDTO.setEmail(tenant.getEmail());
                responseDTO.setPhone(tenant.getPhone());
                responseDTO.setRoomId(tenant.getRoomId());
                responseDTO.setStatus(tenant.getStatus());
                responseDTO.setApplicationDate(tenant.getApplicationDate());
                return responseDTO;
            }
        }
        return null;
    }

    public String deleteTenant(int id) {
        for (Tenant tenant : tenantList) {
            if (tenant.getId() == id) {
                tenantList.remove(tenant);
                return "Tenant deleted";
            }
        }
        return "Tenant not Found";
    }
}
