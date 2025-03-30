package com.virtukch.nest.post.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class PostSummaryDto {
    private Long id;
    private String title;
    private String previewContent;
    private String authorName;
    private List<String> tags;
    private int viewCount;
    private String createdAt;
}