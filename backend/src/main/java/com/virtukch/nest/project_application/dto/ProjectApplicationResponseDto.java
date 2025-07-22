package com.virtukch.nest.project_application.dto;

import com.virtukch.nest.project.model.ApplicationStatus;
import com.virtukch.nest.project.model.ProjectParticipant;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectApplicationResponseDto {
    private Long applicationId;
    private Long memberId;
    private String memberName;
    private ProjectParticipant.Part part;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}