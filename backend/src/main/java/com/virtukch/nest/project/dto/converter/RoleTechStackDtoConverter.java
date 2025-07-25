package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.response.RoleTechStackDto;
import com.virtukch.nest.project.model.ProjectRoleTechStack;
import com.virtukch.nest.project.model.enums.Proficiency;
import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleTechStackDtoConverter {

    public static RoleTechStackDto toDto(ProjectRoleTechStack roleTechStack, TechStackResponseDto techStackResponseDto) {
        return RoleTechStackDto.builder()
                .id(roleTechStack.getId())
                .techStack(techStackResponseDto)
                .isRequired(roleTechStack.getIsRequired())
                .proficiency(roleTechStack.getProficiency())
                .build();
    }
}
