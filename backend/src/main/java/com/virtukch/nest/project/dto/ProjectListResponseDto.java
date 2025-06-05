package com.virtukch.nest.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectListResponseDto {
    private List<ProjectSummaryDto> projects;
    private int totalCount;
    private ProjectPageInfoDto pageInfo; // 페이지 정보
}
