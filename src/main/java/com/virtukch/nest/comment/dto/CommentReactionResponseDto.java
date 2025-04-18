package com.virtukch.nest.comment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentReactionResponseDto {
    private Long commentId;
    private int likeCount;
    private int dislikeCount;
    private String message;
}