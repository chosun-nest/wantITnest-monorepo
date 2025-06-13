package com.virtukch.nest.project_application.dto;

import com.virtukch.nest.project_application.model.ProjectApplication;
import com.virtukch.nest.project_member.model.ProjectMember;
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
    private ProjectMember.Part part;
    private ProjectApplication.ApplicationStatus status;
    private LocalDateTime appliedAt;
}