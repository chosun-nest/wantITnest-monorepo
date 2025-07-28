package com.virtukch.nest.project.dto.request;

import com.virtukch.nest.project.model.enums.ProjectStatus;
import lombok.Getter;

@Getter
public class ProjectStatusUpdateRequestDto {
    private ProjectStatus status;
}
