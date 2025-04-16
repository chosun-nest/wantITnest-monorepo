package com.virtukch.nest.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class CommentResponseDto {
    private Long commentId;
    private String content;
    private String authorName;
    private String createdAt;
    private String updatedAt;
    private Long parentId;

    @Builder.Default
    private List<CommentResponseDto> children = new ArrayList<>();
}

