package com.virtukch.nest.chatting_room_member.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChattingRoomMemberRequestDto {
    private Long chattingRoomId;
    private Long memberId;
}