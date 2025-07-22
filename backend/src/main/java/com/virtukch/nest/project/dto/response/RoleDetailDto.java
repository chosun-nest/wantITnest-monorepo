package com.virtukch.nest.project.dto.response;

import java.util.List;

public class RoleDetailDto {
    Long roleId;
    String roleName;
    String roleDescription;
    String additionalRequirements;

    Integer requiredCount;
    Integer currentCount;
    Boolean isActive;

    List<RoleTechStackResponseDto> techStacks;
}
