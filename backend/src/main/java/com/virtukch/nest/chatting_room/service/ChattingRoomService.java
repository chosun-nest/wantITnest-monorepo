package com.virtukch.nest.chatting_room.service;

import com.virtukch.nest.chatting_room.dto.ChattingRoomRequestDto;
import com.virtukch.nest.chatting_room.dto.ChattingRoomResponseDto;
import com.virtukch.nest.chatting_room.model.ChattingRoom;
import com.virtukch.nest.chatting_room.repository.ChattingRoomRepository;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChattingRoomService {

    private final ChattingRoomRepository chattingRoomRepository;

    public ChattingRoomResponseDto createNewChattingRoomWithName(
        ChattingRoomRequestDto requestDto) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        ChattingRoom chattingRoomToSave = ChattingRoom.builder()
            .chattingRoomName(requestDto.getChattingRoomName())
            .createdAt(currentDateTime)
            .lastChattedAt(currentDateTime)
            .build();
        ChattingRoom savedChattingRoom = chattingRoomRepository.save(chattingRoomToSave);
        return toDto(savedChattingRoom);
    }

    public ChattingRoomResponseDto updateChattingRoomNameById(Long id,
        ChattingRoomRequestDto requestDto) {
        ChattingRoom chattingRoomToUpdate = chattingRoomRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("채팅방이 존재하지 않습니다."));
        chattingRoomToUpdate = ChattingRoom.builder()
            .chattingRoomId(chattingRoomToUpdate.getChattingRoomId())
            .chattingRoomName(requestDto.getChattingRoomName())
            .createdAt(chattingRoomToUpdate.getCreatedAt())
            .lastChattedAt(chattingRoomToUpdate.getLastChattedAt())
            .build();
        ChattingRoom updatedChattingRoom = chattingRoomRepository.save(chattingRoomToUpdate);
        return toDto(updatedChattingRoom);
    }

    @Transactional
    public void deleteChattingRoomById(Long id) {
        if (!chattingRoomRepository.existsById(id)) {
            throw new IllegalArgumentException("채팅방이 존재하지 않습니다.");
        }
        chattingRoomRepository.deleteById(id);
    }

    private ChattingRoomResponseDto toDto(ChattingRoom room) {
        return ChattingRoomResponseDto.builder()
            .chattingRoomId(room.getChattingRoomId())
            .chattingRoomName(room.getChattingRoomName())
            .createdAt(room.getCreatedAt())
            .lastChattedAt(room.getLastChattedAt())
            .build();
    }
}
