package com.virtukch.nest.project.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ProjectParticipant {

    // 테이블 고유 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    // 사용자 아이디
    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long roleId;

    @Enumerated(EnumType.STRING)
    private Position position; // 리더 or 멤버

    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    @CreatedDate
    private LocalDateTime joinedAt;

    private LocalDateTime leftAt;

    //======팩토리 메서드======
    public static ProjectParticipant createParticipant(Long projectId, Long memberId, Long roleId, Position position) {
        ProjectParticipant participant = new ProjectParticipant();

        participant.projectId = projectId;
        participant.memberId = memberId;
        participant.roleId = roleId;
        participant.position = position;
        participant.status = ParticipantStatus.ACTIVE;

        return participant;
    }

    //======비즈니스 메서드======
    public void changePosition(Position newPosition) {
        this.position = newPosition;
    }

    public void leave() {
        this.status = ParticipantStatus.LEFT;
        this.leftAt = LocalDateTime.now();
    }

    public void removeMember() {
        this.memberId = null;
    }
}