package com.virtukch.nest.project.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
public class ProjectResponseDTO {

    private Long projectId;
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private boolean isClosed;
    private LocalDate projectStartDate;
    private LocalDate projectEndDate;
}
