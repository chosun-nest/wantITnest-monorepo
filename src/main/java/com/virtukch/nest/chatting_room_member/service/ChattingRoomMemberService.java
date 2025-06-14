package com.virtukch.nest.chatting_room_member.service;

import com.virtukch.nest.chatting_room_member.dto.ChattingRoomMemberRequestDto;
import com.virtukch.nest.chatting_room_member.model.ChattingRoomMember;
import com.virtukch.nest.chatting_room_member.repository.ChattingRoomMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChattingRoomMemberService {

    private final ChattingRoomMemberRepository chattingRoomMemberRepository;

    public void registerChattingRoomMember(
        ChattingRoomMemberRequestDto chattingRoomMemberRegisterOrRemoveRequestDto) {
        ChattingRoomMember chattingRoomMember = ChattingRoomMember.builder()
            .chattingRoomId(chattingRoomMemberRegisterOrRemoveRequestDto.getChattingRoomId())
            .memberId(chattingRoomMemberRegisterOrRemoveRequestDto.getMemberId())
            .build();
        chattingRoomMemberRepository.save(chattingRoomMember);
    }

    public void removeChattingRoomMember(
        ChattingRoomMemberRequestDto chattingRoomMemberRegisterOrRemoveRequestDto) {
        chattingRoomMemberRepository.deleteByChattingRoomIdAndMemberId(
            chattingRoomMemberRegisterOrRemoveRequestDto.getChattingRoomId(),
            chattingRoomMemberRegisterOrRemoveRequestDto.getMemberId());
    }
}
