package com.virtukch.nest.project.dto.request;

import com.virtukch.nest.project.model.Proficiency;
import lombok.Getter;

@Getter
public class RoleTechStackRequestDto {
    Long techStackId;
    Boolean isRequired;
    Proficiency proficiency;
}