package HostelManagement.service;

import HostelManagement.dto.RentPaymentDTO;
import HostelManagement.entity.RentPayment;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RentPaymentService {

    private List<RentPayment> rentPaymentList = new ArrayList<>();

    public RentPaymentDTO addRentPayment(RentPaymentDTO rentPaymentDTO) {
        RentPayment rentPayment = new RentPayment();
        rentPayment.setId(rentPaymentDTO.getId());
        rentPayment.setTenantId(rentPaymentDTO.getTenantId());
        rentPayment.setAmount(rentPaymentDTO.getAmount());
        rentPayment.setMonth(rentPaymentDTO.getMonth());
        rentPayment.setPaymentDate(rentPaymentDTO.getPaymentDate());
        rentPayment.setStatus(rentPaymentDTO.getStatus());
        rentPaymentList.add(rentPayment);

        RentPaymentDTO responseDTO = new RentPaymentDTO();
        responseDTO.setId(rentPayment.getId());
        responseDTO.setTenantId(rentPayment.getTenantId());
        responseDTO.setAmount(rentPayment.getAmount());
        responseDTO.setMonth(rentPayment.getMonth());
        responseDTO.setPaymentDate(rentPayment.getPaymentDate());
        responseDTO.setStatus(rentPayment.getStatus());
        return responseDTO;
    }

    public List<RentPaymentDTO> getAllRentPayments() {
        List<RentPaymentDTO> rentPaymentDTOList = new ArrayList<>();
        for (RentPayment rentPayment : rentPaymentList) {
            RentPaymentDTO rentPaymentDTO = new RentPaymentDTO();
            rentPaymentDTO.setId(rentPayment.getId());
            rentPaymentDTO.setTenantId(rentPayment.getTenantId());
            rentPaymentDTO.setAmount(rentPayment.getAmount());
            rentPaymentDTO.setMonth(rentPayment.getMonth());
            rentPaymentDTO.setPaymentDate(rentPayment.getPaymentDate());
            rentPaymentDTO.setStatus(rentPayment.getStatus());
            rentPaymentDTOList.add(rentPaymentDTO);
        }
        return rentPaymentDTOList;
    }

    public RentPaymentDTO getRentPaymentById(int id) {
        for (RentPayment rentPayment : rentPaymentList) {
            if (rentPayment.getId() == id) {
                RentPaymentDTO rentPaymentDTO = new RentPaymentDTO();
                rentPaymentDTO.setId(rentPayment.getId());
                rentPaymentDTO.setTenantId(rentPayment.getTenantId());
                rentPaymentDTO.setAmount(rentPayment.getAmount());
                rentPaymentDTO.setMonth(rentPayment.getMonth());
                rentPaymentDTO.setPaymentDate(rentPayment.getPaymentDate());
                rentPaymentDTO.setStatus(rentPayment.getStatus());
                return rentPaymentDTO;
            }
        }
        return null;
    }

    public RentPaymentDTO updateRentPayment(int id, RentPaymentDTO rentPaymentDTO) {
        for (RentPayment rentPayment : rentPaymentList) {
            if (rentPayment.getId() == id) {
                rentPayment.setTenantId(rentPaymentDTO.getTenantId());
                rentPayment.setAmount(rentPaymentDTO.getAmount());
                rentPayment.setMonth(rentPaymentDTO.getMonth());
                rentPayment.setPaymentDate(rentPaymentDTO.getPaymentDate());
                rentPayment.setStatus(rentPaymentDTO.getStatus());

                RentPaymentDTO responseDTO = new RentPaymentDTO();
                responseDTO.setId(rentPayment.getId());
                responseDTO.setTenantId(rentPayment.getTenantId());
                responseDTO.setAmount(rentPayment.getAmount());
                responseDTO.setMonth(rentPayment.getMonth());
                responseDTO.setPaymentDate(rentPayment.getPaymentDate());
                responseDTO.setStatus(rentPayment.getStatus());
                return responseDTO;
            }
        }
        return null;
    }

    public String deleteRentPayment(int id) {
        for (RentPayment rentPayment : rentPaymentList) {
            if (rentPayment.getId() == id) {
                rentPaymentList.remove(rentPayment);
                return "RentPayment deleted";
            }
        }
        return "RentPayment not Found";
    }
}
