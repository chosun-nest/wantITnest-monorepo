package com.virtukch.nest.project_application.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    @Column(nullable = false)
    private Long projectId;

    @Column(nullable = false)
    private Long memberId;

    @Column(nullable = false)
    private Long roleId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    @Column(columnDefinition = "TEXT")
    private String applicationMessage;

    @Column(columnDefinition = "TEXT")
    private String reviewComment;

    // 투입 가능 일자
    @Column(nullable = false)
    private LocalDateTime availableTime;

    // 지원 일자
    @Column(nullable = false)
    private LocalDateTime appliedAt;

    // 검토 일시
    private LocalDateTime reviewedAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    // ======팩토리 메서드=======
    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }
}
