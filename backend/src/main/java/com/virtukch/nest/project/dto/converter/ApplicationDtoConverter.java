package com.virtukch.nest.project.dto.converter;

import com.virtukch.nest.project.dto.response.ApplicationListDto;
import com.virtukch.nest.project.dto.response.MyApplicationResponseDto;
import com.virtukch.nest.project.model.ProjectApplication;
import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ApplicationDtoConverter {
    
    public static MyApplicationResponseDto toMyApplicationDto(ProjectApplication application) {
        return MyApplicationResponseDto.builder()
                .applicationId(application.getId())
                .projectId(application.getProject().getId())
                .projectTitle(application.getProject().getProjectTitle())
                .roleName(application.getRole().getRoleName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .reviewedAt(application.getReviewedAt())
                .canEdit(application.getStatus() == ApplicationStatus.PENDING)
                .build();
    }

    public static ApplicationListDto toApplicationListDto(ProjectApplication application) {
        String truncatedMessage = application.getApplicationMessage();
        if (truncatedMessage != null && truncatedMessage.length() > 50) {
            truncatedMessage = truncatedMessage.substring(0, 50) + "...";
        }

        return ApplicationListDto.builder()
                .applicationId(application.getId())
                .memberId(application.getMember().getMemberId())
                .applicantName(application.getMember().getMemberName())
                .applicantEmail(application.getMember().getMemberEmail())
                .roleName(application.getRole().getRoleName())
                .status(application.getStatus())
                .appliedAt(application.getAppliedAt())
                .applicationMessage(truncatedMessage)
                .build();
    }
}