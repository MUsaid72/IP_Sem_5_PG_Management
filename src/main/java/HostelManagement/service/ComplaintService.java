package HostelManagement.service;

import HostelManagement.dto.ComplaintDTO;
import HostelManagement.entity.Complaint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ComplaintService {

    private List<Complaint> complaintList = new ArrayList<>();

    public ComplaintDTO addComplaint(ComplaintDTO complaintDTO) {
        Complaint complaint = new Complaint();
        complaint.setId(complaintDTO.getId());
        complaint.setTenantId(complaintDTO.getTenantId());
        complaint.setTitle(complaintDTO.getTitle());
        complaint.setDescription(complaintDTO.getDescription());
        complaint.setStatus(complaintDTO.getStatus());
        complaint.setCreatedDate(complaintDTO.getCreatedDate());
        complaintList.add(complaint);

        ComplaintDTO responseDTO = new ComplaintDTO();
        responseDTO.setId(complaint.getId());
        responseDTO.setTenantId(complaint.getTenantId());
        responseDTO.setTitle(complaint.getTitle());
        responseDTO.setDescription(complaint.getDescription());
        responseDTO.setStatus(complaint.getStatus());
        responseDTO.setCreatedDate(complaint.getCreatedDate());
        return responseDTO;
    }

    public List<ComplaintDTO> getAllComplaints() {
        List<ComplaintDTO> complaintDTOList = new ArrayList<>();
        for (Complaint complaint : complaintList) {
            ComplaintDTO complaintDTO = new ComplaintDTO();
            complaintDTO.setId(complaint.getId());
            complaintDTO.setTenantId(complaint.getTenantId());
            complaintDTO.setTitle(complaint.getTitle());
            complaintDTO.setDescription(complaint.getDescription());
            complaintDTO.setStatus(complaint.getStatus());
            complaintDTO.setCreatedDate(complaint.getCreatedDate());
            complaintDTOList.add(complaintDTO);
        }
        return complaintDTOList;
    }

    public ComplaintDTO getComplaintById(int id) {
        for (Complaint complaint : complaintList) {
            if (complaint.getId() == id) {
                ComplaintDTO complaintDTO = new ComplaintDTO();
                complaintDTO.setId(complaint.getId());
                complaintDTO.setTenantId(complaint.getTenantId());
                complaintDTO.setTitle(complaint.getTitle());
                complaintDTO.setDescription(complaint.getDescription());
                complaintDTO.setStatus(complaint.getStatus());
                complaintDTO.setCreatedDate(complaint.getCreatedDate());
                return complaintDTO;
            }
        }
        return null;
    }

    public ComplaintDTO updateComplaint(int id, ComplaintDTO complaintDTO) {
        for (Complaint complaint : complaintList) {
            if (complaint.getId() == id) {
                complaint.setTenantId(complaintDTO.getTenantId());
                complaint.setTitle(complaintDTO.getTitle());
                complaint.setDescription(complaintDTO.getDescription());
                complaint.setStatus(complaintDTO.getStatus());
                complaint.setCreatedDate(complaintDTO.getCreatedDate());

                ComplaintDTO responseDTO = new ComplaintDTO();
                responseDTO.setId(complaint.getId());
                responseDTO.setTenantId(complaint.getTenantId());
                responseDTO.setTitle(complaint.getTitle());
                responseDTO.setDescription(complaint.getDescription());
                responseDTO.setStatus(complaint.getStatus());
                responseDTO.setCreatedDate(complaint.getCreatedDate());
                return responseDTO;
            }
        }
        return null;
    }

    public String deleteComplaint(int id) {
        for (Complaint complaint : complaintList) {
            if (complaint.getId() == id) {
                complaintList.remove(complaint);
                return "Complaint deleted";
            }
        }
        return "Complaint not Found";
    }
}
