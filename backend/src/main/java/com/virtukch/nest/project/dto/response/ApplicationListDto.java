package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApplicationListDto {
    private Long applicationId;
    private Long memberId;
    private String applicantName;
    private String applicantEmail;
    private String roleName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private String applicationMessage;         // 요약 (50자)
}
