package com.virtukch.nest.chatting_room_member.repository;

import com.virtukch.nest.chatting_room_member.model.ChattingRoomMember;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChattingRoomMemberRepository extends JpaRepository<ChattingRoomMember, Long> {

    void deleteByChattingRoomIdAndMemberId(Long chattingRoomId, Long memberId);

    @Query("SELECT crm.chattingRoomId FROM ChattingRoomMember crm WHERE crm.memberId = :memberId")
    List<Long> findChattingRoomIdListByMemberId(@Param("memberId") Long memberId);
}
