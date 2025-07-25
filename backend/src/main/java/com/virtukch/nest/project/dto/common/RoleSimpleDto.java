package com.virtukch.nest.project.dto.common;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoleSimpleDto {
    private Long roleId;
    private String roleName;
    private Boolean isActive;
    private Integer requiredCount;
    private Integer currentCount;
}
