package com.virtukch.nest.project_application.dto.converter;

import com.virtukch.nest.project_application.dto.ProjectApplicationResponseDto;
import com.virtukch.nest.project_application.model.ProjectApplication;

public class ProjectApplicationDtoConverter {
    public static ProjectApplicationResponseDto toResponseDto(ProjectApplication application, String memberName) {
        return ProjectApplicationResponseDto.builder()
                .applicationId(application.getApplicationId())
                .memberId(application.getMemberId())
                .memberName(memberName)
                .part(application.getPart())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
