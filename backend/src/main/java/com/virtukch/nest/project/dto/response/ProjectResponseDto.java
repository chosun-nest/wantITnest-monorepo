package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.ProjectStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponseDto {
    private Long projectId;
    private String projectTitle;
    private ProjectStatus status;           // RECRUITING
    private Integer totalMemberNeeded;      // 4
    private Integer currentMembers;         // 1
    private String recruitmentEndDate;
    private String message;                 // "프로젝트가 생성되었습니다"
}
