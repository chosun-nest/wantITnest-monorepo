package com.virtukch.nest.project_application.model;

import com.virtukch.nest.project_member.model.ProjectMember;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ProjectApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationId;

    private Long projectId;

    private Long memberId;

    @Enumerated(EnumType.STRING)
    private ProjectMember.Part part;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ApplicationStatus status;

    private LocalDateTime appliedAt;

    public enum ApplicationStatus {
        WAITING,
        ACCEPTED,
        REJECTED,
        CANCELED
    }

    public void updateStatus(ApplicationStatus newStatus) {
        this.status = newStatus;
    }
}
