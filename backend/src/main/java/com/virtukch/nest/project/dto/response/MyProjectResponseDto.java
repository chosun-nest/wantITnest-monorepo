package com.virtukch.nest.project.dto.response;

import com.virtukch.nest.project.dto.ProjectDetailResponseDto;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MyProjectResponseDto {
    ProjectDetailResponseDto projectInfo;       // 기본 프로젝트 정보
    Integer totalApplicationCount;             // 전체 지원서 수
    Integer pendingApplicationCount;           // 대기중인 지원서 수
    Integer acceptedApplicationCount;          // 승인된 지원서 수
    List<RoleApplicationSummaryDto> roleApplications;  // 역할별 지원 현황
    LocalDateTime lastApplicationAt;           // 마지막 지원 시각
}
