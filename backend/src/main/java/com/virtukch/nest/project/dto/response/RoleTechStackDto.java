package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.Proficiency;
import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoleTechStackDto {
    Long id;
    TechStackResponseDto techStack;
    Boolean isRequired;
    Proficiency proficiency;
}
