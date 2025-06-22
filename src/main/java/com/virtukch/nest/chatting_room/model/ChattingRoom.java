package com.virtukch.nest.chatting_room.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChattingRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chattingRoomId;

    @Column(nullable = false, unique = true)
    private String chattingRoomName;

    private LocalDateTime createdAt;

    private LocalDateTime lastChattedAt;
}