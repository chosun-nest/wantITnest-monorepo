package com.virtukch.nest.project.dto;

import com.virtukch.nest.post.dto.AuthorDto;
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
    private AuthorDto author;
    private List<String> tags;
    private int viewCount;
    private String createdAt;
    private Long commentCount;
    private String imageUrl;
}
