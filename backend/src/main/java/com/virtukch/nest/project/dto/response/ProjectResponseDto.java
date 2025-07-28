package com.virtukch.nest.project.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.virtukch.nest.project.model.enums.ProjectStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProjectResponseDto {
    private Long projectId;
    private String projectTitle;
    private ProjectStatus status;           // RECRUITING
    private Integer totalMemberNeeded;      // 4
    private Integer currentMembers;         // 1
    private String recruitmentEndDate;
}
