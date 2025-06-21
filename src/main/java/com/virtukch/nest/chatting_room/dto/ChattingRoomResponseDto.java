package com.virtukch.nest.chatting_room.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChattingRoomResponseDto {
    private Long chattingRoomId;
    private String chattingRoomName;
    private LocalDateTime createdAt;
    private LocalDateTime lastChattedAt;
}
