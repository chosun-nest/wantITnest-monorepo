package com.virtukch.nest.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUpdateRequestDto {
    private String projectTitle;
    private String projectDescription;
    private int maxMember;
    private LocalDate projectStartDate;
    private LocalDate projectEndDate;
    private boolean isRecruiting;
}