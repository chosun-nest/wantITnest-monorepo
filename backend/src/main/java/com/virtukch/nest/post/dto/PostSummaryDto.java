package com.virtukch.nest.post.dto;

import com.virtukch.nest.common.dto.AuthorDto;
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
    private AuthorDto author;
    private List<String> tags;
    private Long viewCount;
    private Long likeCount;
    private Long dislikeCount;
    private String createdAt;
    private Long commentCount;
    private String ImageUrl; // 게시글 최상위 이미지 url
}