package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.Proficiency;

public class RoleTechStackResponseDto {
    Long roleId;
    Long techStackId;
    String techStackName;
    Boolean isRequired;
    Proficiency proficiency;
}
