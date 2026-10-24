package HostelManagement.controller;

import HostelManagement.dto.RentPaymentDTO;
import HostelManagement.service.RentPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/rentpayments", "/rentpayments"})
@CrossOrigin(origins = "*")
public class RentPaymentController {

    @Autowired
    private RentPaymentService rentPaymentService;

    @PostMapping
    public RentPaymentDTO addRentPayment(@RequestBody RentPaymentDTO rentPaymentDTO) {
        return rentPaymentService.addRentPayment(rentPaymentDTO);
    }

    @GetMapping
    public List<RentPaymentDTO> getAllRentPayments() {
        return rentPaymentService.getAllRentPayments();
    }

    @GetMapping("/{id}")
    public RentPaymentDTO getRentPaymentById(@PathVariable int id) {
        return rentPaymentService.getRentPaymentById(id);
    }

    @PutMapping("/{id}")
    public RentPaymentDTO updateRentPayment(@PathVariable int id, @RequestBody RentPaymentDTO rentPaymentDTO) {
        return rentPaymentService.updateRentPayment(id, rentPaymentDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteRentPayment(@PathVariable int id) {
        return rentPaymentService.deleteRentPayment(id);
    }
}
