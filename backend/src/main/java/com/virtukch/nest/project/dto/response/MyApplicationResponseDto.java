package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.model.enums.ApplicationStatus;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 내 지원서 목록
 */
@Getter
@Builder
public class MyApplicationResponseDto {
    private Long applicationId;
    private Long projectId;
    private String projectTitle;
    private String roleName;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String reviewComment;
    private Boolean canEdit;                   // 수정 가능 여부
}
