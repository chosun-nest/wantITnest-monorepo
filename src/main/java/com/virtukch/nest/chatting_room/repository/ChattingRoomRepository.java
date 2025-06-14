package com.virtukch.nest.chatting_room.repository;

import com.virtukch.nest.chatting_room.model.ChattingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChattingRoomRepository extends JpaRepository<ChattingRoom, Long> {

}
