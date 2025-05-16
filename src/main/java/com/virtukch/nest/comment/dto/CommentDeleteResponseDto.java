package com.virtukch.nest.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class CommentDeleteResponseDto {
    private Long commentId;
    private String message;
}