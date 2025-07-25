package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.common.RoleSimpleDto;
import com.virtukch.nest.project.dto.response.RoleDetailDto;
import com.virtukch.nest.project.dto.response.RoleListDto;
import com.virtukch.nest.project.dto.response.RoleTechStackDto;
import com.virtukch.nest.project.model.ProjectRole;
import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleDtoConverter {

    public static RoleListDto toListDto(List<RoleDetailDto> roleInfos, Integer totalNeededMembers, Integer currentMembers) {
        return RoleListDto.builder()
                .roleInfos(roleInfos)
                .totalMemberNeeded(totalNeededMembers)
                .currentMembers(currentMembers)
                .build();
    }

    public static RoleDetailDto toDetailDto(ProjectRole role, List<RoleTechStackDto> techStacks) {
        return RoleDetailDto.builder()
                .roleId(role.getId())
                .roleName(role.getRoleName())
                .roleDescription(role.getRoleDescription())
                .additionalRequirements(role.getAdditionalRequirements())
                .requiredCount(role.getRequiredCount())
                .currentCount(role.getCurrentCount())
                .isActive(role.getIsActive())
                .techStacks(techStacks)
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
