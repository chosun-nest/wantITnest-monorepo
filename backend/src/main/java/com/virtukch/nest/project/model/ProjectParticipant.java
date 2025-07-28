package com.virtukch.nest.project.model;

import com.virtukch.nest.member.model.Member;
import com.virtukch.nest.project.model.enums.ParticipantStatus;
import com.virtukch.nest.project.model.enums.Position;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ProjectParticipant {

    // 테이블 고유 PK
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private ProjectRole role;

    @Enumerated(EnumType.STRING)
    private Position position; // 리더 or 멤버

    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    @CreatedDate
    private LocalDateTime joinedAt;

    private LocalDateTime leftAt;

    //======팩토리 메서드======
    public static ProjectParticipant create(Member member, ProjectRole role, Position position) {
        return ProjectParticipant.builder()
                .member(member)
                .role(role)
                .position(position)
                .status(ParticipantStatus.ACTIVE)
                .build();
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
        this.member = null;
    }
}