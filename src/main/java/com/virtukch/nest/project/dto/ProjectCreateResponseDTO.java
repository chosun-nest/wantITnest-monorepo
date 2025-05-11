package com.virtukch.nest.project.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class ProjectCreateResponseDTO {

    private Long projectId;
    private String message;
}
