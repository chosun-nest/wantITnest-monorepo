package com.virtukch.nest.chatting_room_member.repository;

import com.virtukch.nest.chatting_room_member.model.ChattingRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChattingRoomMemberRepository extends JpaRepository<ChattingRoomMember, Long> {

    void deleteByChattingRoomIdAndMemberId(Long chattingRoomId, Long memberId);
}
