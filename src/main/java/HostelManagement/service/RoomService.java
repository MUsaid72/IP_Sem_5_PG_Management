package HostelManagement.service;

import HostelManagement.dto.RoomDTO;
import HostelManagement.entity.Room;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoomService {

    private List<Room> roomList = new ArrayList<>();

    public RoomDTO addRoom(RoomDTO roomDTO) {
        Room room = new Room();
        room.setId(roomDTO.getId());
        room.setOwnerId(roomDTO.getOwnerId());
        room.setRoomNumber(roomDTO.getRoomNumber());
        room.setType(roomDTO.getType());
        room.setRentAmount(roomDTO.getRentAmount());
        room.setStatus(roomDTO.getStatus());
        roomList.add(room);

        RoomDTO responseDTO = new RoomDTO();
        responseDTO.setId(room.getId());
        responseDTO.setOwnerId(room.getOwnerId());
        responseDTO.setRoomNumber(room.getRoomNumber());
        responseDTO.setType(room.getType());
        responseDTO.setRentAmount(room.getRentAmount());
        responseDTO.setStatus(room.getStatus());
        return responseDTO;
    }

    public List<RoomDTO> getAllRooms() {
        List<RoomDTO> roomDTOList = new ArrayList<>();
        for (Room room : roomList) {
            RoomDTO roomDTO = new RoomDTO();
            roomDTO.setId(room.getId());
            roomDTO.setOwnerId(room.getOwnerId());
            roomDTO.setRoomNumber(room.getRoomNumber());
            roomDTO.setType(room.getType());
            roomDTO.setRentAmount(room.getRentAmount());
            roomDTO.setStatus(room.getStatus());
            roomDTOList.add(roomDTO);
        }
        return roomDTOList;
    }

    public RoomDTO getRoomById(int id) {
        for (Room room : roomList) {
            if (room.getId() == id) {
                RoomDTO roomDTO = new RoomDTO();
                roomDTO.setId(room.getId());
                roomDTO.setOwnerId(room.getOwnerId());
                roomDTO.setRoomNumber(room.getRoomNumber());
                roomDTO.setType(room.getType());
                roomDTO.setRentAmount(room.getRentAmount());
                roomDTO.setStatus(room.getStatus());
                return roomDTO;
            }
        }
        return null;
    }

    public RoomDTO updateRoom(int id, RoomDTO roomDTO) {
        for (Room room : roomList) {
            if (room.getId() == id) {
                room.setOwnerId(roomDTO.getOwnerId());
                room.setRoomNumber(roomDTO.getRoomNumber());
                room.setType(roomDTO.getType());
                room.setRentAmount(roomDTO.getRentAmount());
                room.setStatus(roomDTO.getStatus());

                RoomDTO responseDTO = new RoomDTO();
                responseDTO.setId(room.getId());
                responseDTO.setOwnerId(room.getOwnerId());
                responseDTO.setRoomNumber(room.getRoomNumber());
                responseDTO.setType(room.getType());
                responseDTO.setRentAmount(room.getRentAmount());
                responseDTO.setStatus(room.getStatus());
                return responseDTO;
            }
        }
        return null;
    }

    public String deleteRoom(int id) {
        for (Room room : roomList) {
            if (room.getId() == id) {
                roomList.remove(room);
                return "Room deleted";
            }
        }
        return "Room not Found";
    }
}
