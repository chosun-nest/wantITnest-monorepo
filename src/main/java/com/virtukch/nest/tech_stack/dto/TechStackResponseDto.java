package com.virtukch.nest.tech_stack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TechStackResponseDto {

    private Long techStackId;
    private String techStackName;
}
