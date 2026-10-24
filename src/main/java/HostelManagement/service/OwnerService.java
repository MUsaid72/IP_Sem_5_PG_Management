package HostelManagement.service;

import HostelManagement.dto.OwnerDTO;
import HostelManagement.entity.Owner;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OwnerService {

    private List<Owner> ownerList = new ArrayList<>();

    public OwnerDTO addOwner(OwnerDTO ownerDTO) {
        Owner owner = new Owner();
        owner.setId(ownerDTO.getId());
        owner.setName(ownerDTO.getName());
        owner.setEmail(ownerDTO.getEmail());
        owner.setPhone(ownerDTO.getPhone());
        owner.setAddress(ownerDTO.getAddress());
        ownerList.add(owner);

        OwnerDTO responseDTO = new OwnerDTO();
        responseDTO.setId(owner.getId());
        responseDTO.setName(owner.getName());
        responseDTO.setEmail(owner.getEmail());
        responseDTO.setPhone(owner.getPhone());
        responseDTO.setAddress(owner.getAddress());
        return responseDTO;
    }

    public List<OwnerDTO> getAllOwners() {
        List<OwnerDTO> ownerDTOList = new ArrayList<>();
        for (Owner owner : ownerList) {
            OwnerDTO ownerDTO = new OwnerDTO();
            ownerDTO.setId(owner.getId());
            ownerDTO.setName(owner.getName());
            ownerDTO.setEmail(owner.getEmail());
            ownerDTO.setPhone(owner.getPhone());
            ownerDTO.setAddress(owner.getAddress());
            ownerDTOList.add(ownerDTO);
        }
        return ownerDTOList;
    }

    public OwnerDTO getOwnerById(int id) {
        for (Owner owner : ownerList) {
            if (owner.getId() == id) {
                OwnerDTO ownerDTO = new OwnerDTO();
                ownerDTO.setId(owner.getId());
                ownerDTO.setName(owner.getName());
                ownerDTO.setEmail(owner.getEmail());
                ownerDTO.setPhone(owner.getPhone());
                ownerDTO.setAddress(owner.getAddress());
                return ownerDTO;
            }
        }
        return null;
    }

    public OwnerDTO updateOwner(int id, OwnerDTO ownerDTO) {
        for (Owner owner : ownerList) {
            if (owner.getId() == id) {
                owner.setName(ownerDTO.getName());
                owner.setEmail(ownerDTO.getEmail());
                owner.setPhone(ownerDTO.getPhone());
                owner.setAddress(ownerDTO.getAddress());

                OwnerDTO responseDTO = new OwnerDTO();
                responseDTO.setId(owner.getId());
                responseDTO.setName(owner.getName());
                responseDTO.setEmail(owner.getEmail());
                responseDTO.setPhone(owner.getPhone());
                responseDTO.setAddress(owner.getAddress());
                return responseDTO;
            }
        }
        return null;
    }

    public String deleteOwner(int id) {
        for (Owner owner : ownerList) {
            if (owner.getId() == id) {
                ownerList.remove(owner);
                return "Owner deleted";
            }
        }
        return "Owner not Found";
    }
}
