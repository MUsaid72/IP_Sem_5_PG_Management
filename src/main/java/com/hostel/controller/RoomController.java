package com.hostel.controller;

import com.hostel.dto.RoomDTO;
import com.hostel.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // GET all rooms (for Owner or all listings)
    @GetMapping
    public List<RoomDTO> getAllRooms() {
        return roomService.getAllRooms();
    }

    // GET available rooms only
    @GetMapping("/available")
    public List<RoomDTO> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

    // GET room by ID
    @GetMapping("/{id}")
    public RoomDTO getRoomById(@PathVariable int id) {
        return roomService.getRoomById(id);
    }

    // POST add room (from Owner)
    @PostMapping
    public RoomDTO addRoom(@RequestBody RoomDTO dto) {
        return roomService.addRoom(dto);
    }

    // PUT update room
    @PutMapping("/{id}")
    public RoomDTO updateRoom(@PathVariable int id, @RequestBody RoomDTO dto) {
        return roomService.updateRoom(id, dto);
    }

    // DELETE room
    @DeleteMapping("/{id}")
    public String deleteRoom(@PathVariable int id) {
        return roomService.deleteRoom(id);
    }
}
