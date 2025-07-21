package com.virtukch.nest.project_member.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ProjectParticipant {

    // 테이블 고유 아이디
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    // 사용자 아이디
    @Column(nullable = false)
    private Long participantId;

    @Column(nullable = false)
    private Long roleId;

    @Enumerated(EnumType.STRING)
    private Position position; // 리더 or 멤버

    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    @CreatedDate
    private LocalDateTime joinedAt;

    private LocalDateTime leftAt;

    public void removeMember() {
        this.participantId = null;
    }
}