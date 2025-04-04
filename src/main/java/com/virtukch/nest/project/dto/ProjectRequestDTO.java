package com.virtukch.nest.project.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class ProjectRequestDTO {

    private Long projectLeaderId;
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private LocalDate projectStartDate;
    private LocalDate projectEndDate;
}
