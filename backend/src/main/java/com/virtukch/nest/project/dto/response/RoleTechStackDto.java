package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.Proficiency;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoleTechStackDto {
    Long techStackId;
    String techStackName;
    Boolean isRequired;
    Proficiency proficiency;
}
