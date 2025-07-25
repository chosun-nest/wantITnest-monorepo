package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.common.RoleSimpleDto;
import com.virtukch.nest.project.dto.response.RoleDetailDto;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.model.ProjectRole;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleDtoConverter {

    public static RoleListDto toListDto(ProjectRole role) {
        return RoleListDto.builder().build(); // TODO
    }

    public static RoleDetailDto toDetailDto(ProjectRole role) {
        return RoleDetailDto.builder()
                .roleId(role.getId())
                .roleName(role.getRoleName())
                .roleDescription(role.getRoleDescription())
                .additionalRequirements(role.getAdditionalRequirements())
                .requiredCount(role.getRequiredCount())
                .currentCount(role.getCurrentCount())
                .isActive(role.getIsActive())
                .techStacks(null) // TODO
                .build();
    }

    public static RoleSimpleDto toSimpleDto(ProjectRole role) {
        return RoleSimpleDto.builder()
                .roleId(role.getId())
                .roleName(role.getRoleName())
                .requiredCount(role.getRequiredCount())
                .currentCount(role.getCurrentCount())
                .isActive(role.getIsActive())
                .build();
    }
}
