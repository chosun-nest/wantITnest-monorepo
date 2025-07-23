package com.virtukch.nest.project.dto.request;

import lombok.Getter;

import java.util.List;

@Getter
public class RoleCreateRequestDto {
    String roleName;
    String roleDescription;
    String additionalRequirements;
    Integer requiredCount;
    List<RoleTechStackRequestDto> techStacks;
}
