package com.virtukch.nest.project.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectResponseDto {

    private Long projectId;
    private String message;
}
