package com.virtukch.nest.project_application.dto.converter;

import com.virtukch.nest.project.dto.response.ApplicationDetailResponseDto;
import com.virtukch.nest.project.model.ProjectApplication;

public class ProjectApplicationDtoConverter {
    public static ApplicationDetailResponseDto toResponseDto(ProjectApplication application, String memberName) {
        return ApplicationDetailResponseDto.builder()
                .applicationId(application.getApplicationId())
                .memberId(application.getMemberId())
                .memberName(memberName)
                .part(application.getPart())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .build();
    }
}
