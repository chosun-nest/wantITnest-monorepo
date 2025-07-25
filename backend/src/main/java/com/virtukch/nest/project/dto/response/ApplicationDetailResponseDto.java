package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class ApplicationDetailResponseDto {
    private Long applicationId;
    private Long projectId;
    private String projectTitle;
    private MemberSimpleDto applicant;        // 지원자 정보
    private ProjectRoleDetailDto role;        // 지원 역할 상세 정보
    private ApplicationStatus status;
    private String applicationMessage;
    private LocalDate availableStartDate;
    private String availableTimeSlots;
    private String timePreferenceNote;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String reviewComment;
    private MemberSimpleDto reviewer;         // 검토자 정보
    private List<TechStackDto> memberTechStacks;     // 지원자 보유 기술스택
}
