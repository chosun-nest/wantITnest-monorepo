package com.virtukch.nest.project.dto;

import com.virtukch.nest.common.dto.PageInfoDto;
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
    private PageInfoDto pageInfo; // 페이지 정보
}
