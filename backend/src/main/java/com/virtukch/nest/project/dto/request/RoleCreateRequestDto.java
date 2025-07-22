package com.virtukch.nest.project.dto.request;

import java.util.List;

public class RoleCreateRequestDto {
    String roleName;
    String roleDescription;
    String additionalRequirements;
    List<RoleTechStackRequestDto> techStacks;
}
