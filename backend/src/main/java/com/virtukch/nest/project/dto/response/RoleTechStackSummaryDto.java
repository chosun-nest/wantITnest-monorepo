package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.tech_stack.dto.TechStackResponseDto;

import java.util.List;

public class RoleTechStackSummaryDto {
    Long roleId;
    List<TechStackResponseDto> requiredTechStacks;  // 필수 기술스택
    List<TechStackResponseDto> preferredTechStacks; // 우대 기술스택
}
