package com.virtukch.nest.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ProjectSummaryDto {
    private Long projectId;
    private String projectTitle;
    private String previewContent;
    private String authorName;
    private List<String> tags;
    private int viewCount;
    private String createdAt;
}
