package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.response.RoleTechStackDto;
import com.virtukch.nest.project.model.enums.Proficiency;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleTechStackDtoConverter {

    public static RoleTechStackDto toDto(Long techStackId, String techStackName,
                                                      Boolean isRequired, Proficiency proficiency) {
        return RoleTechStackDto.builder()
                .techStackId(techStackId)
                .techStackName(techStackName)
                .isRequired(isRequired)
                .proficiency(proficiency)
                .build();
    }
}
