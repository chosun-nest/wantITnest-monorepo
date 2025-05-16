package com.virtukch.nest.project.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProjectCreateResponseDto {

    private Long projectId;
    private String message;
}
