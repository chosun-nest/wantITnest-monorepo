package com.virtukch.nest.post.dto;

import com.virtukch.nest.common.dto.PageInfoDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@AllArgsConstructor
@Getter
@Builder
public class PostListResponseDto {
    private List<PostSummaryDto> posts;
    private int totalCount;
    private PageInfoDto pageInfo; // 페이지 정보
}