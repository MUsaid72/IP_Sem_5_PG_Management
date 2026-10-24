package HostelManagement.controller;

import HostelManagement.dto.RoomDTO;
import HostelManagement.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/rooms", "/rooms"})
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public RoomDTO addRoom(@RequestBody RoomDTO roomDTO) {
        return roomService.addRoom(roomDTO);
    }

    @GetMapping
    public List<RoomDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/{id}")
    public RoomDTO getRoomById(@PathVariable int id) {
        return roomService.getRoomById(id);
    }

    @PutMapping("/{id}")
    public RoomDTO updateRoom(@PathVariable int id, @RequestBody RoomDTO roomDTO) {
        return roomService.updateRoom(id, roomDTO);
    }

    @DeleteMapping("/{id}")
    public String deleteRoom(@PathVariable int id) {
        return roomService.deleteRoom(id);
    }
}
