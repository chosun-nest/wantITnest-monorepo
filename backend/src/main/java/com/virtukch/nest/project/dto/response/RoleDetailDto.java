package com.virtukch.nest.project.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RoleDetailDto {
    Long roleId;
    String roleName;
    String roleDescription;
    String additionalRequirements;

    Integer requiredCount;
    Integer currentCount;
    Boolean isActive;

    List<RoleTechStackDto> techStacks;
}
