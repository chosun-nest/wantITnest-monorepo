package com.virtukch.nest.project.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 역할 상세 정보
 */
@Getter
@Builder
public class ProjectRoleDetailDto {
    private Long roleId;
    private String roleName;
    private String roleDescription;
    private Integer requiredCount;
    private Integer currentCount;
    private String additionalRequirements;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private List<RoleTechStackDto> techStacks;  // 전체 기술스택 요구사항
}
